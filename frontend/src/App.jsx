import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import PredictionPage from './pages/PredictionPage'
import ResultPage from './pages/ResultPage'
import DashboardPage from './pages/DashboardPage'
import { PredictionProvider } from './hooks/usePrediction'

function App() {
  return (
    <PredictionProvider>
      <Router>
        <div className="min-h-screen bg-void relative overflow-hidden">
          {/* Background Effects */}
          <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="fixed inset-0 bg-gradient-to-b from-transparent via-void/50 to-void pointer-events-none" />

          {/* Floating particles */}
          <div className="fixed inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-neon-green/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 6}s`,
                  animationDuration: `${6 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          <Navbar />

          <main className="relative z-10">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/predict" element={<PredictionPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </Router>
    </PredictionProvider>
  )
}

export default App