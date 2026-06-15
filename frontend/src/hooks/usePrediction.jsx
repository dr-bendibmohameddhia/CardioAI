import React, { createContext, useContext, useState, useCallback } from 'react'

const PredictionContext = createContext()

export function PredictionProvider({ children }) {
  const [predictionData, setPredictionData] = useState(null)
  const [explanationData, setExplanationData] = useState(null)
  const [patientHistory, setPatientHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const predict = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Prediction failed')

      const data = await response.json()
      setPredictionData(data)

      // Add to history
      setPatientHistory(prev => [...prev, {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        data: formData,
        result: data
      }])

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const explain = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Explanation failed')

      const data = await response.json()
      setExplanationData(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [API_URL])

  const clearPrediction = useCallback(() => {
    setPredictionData(null)
    setExplanationData(null)
    setError(null)
  }, [])

  return (
    <PredictionContext.Provider value={{
      predictionData,
      explanationData,
      patientHistory,
      loading,
      error,
      predict,
      explain,
      clearPrediction,
      setPredictionData,
      setExplanationData
    }}>
      {children}
    </PredictionContext.Provider>
  )
}

export const usePrediction = () => {
  const context = useContext(PredictionContext)
  if (!context) throw new Error('usePrediction must be used within PredictionProvider')
  return context
}