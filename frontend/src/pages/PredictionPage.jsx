import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Activity, ChevronRight, AlertCircle, 
  User, Droplets, Zap, TrendingUp, Stethoscope,
  Thermometer, HeartPulse, ActivitySquare, LineChart
} from 'lucide-react'
import { usePrediction } from '../hooks/usePrediction'
import GlassCard from '../components/GlassCard'

const formFields = [
  {
    id: 'age',
    label: 'Age',
    type: 'number',
    min: 1,
    max: 120,
    placeholder: 'e.g., 54',
    icon: User,
    description: 'Patient age in years',
    category: 'demographics'
  },
  {
    id: 'sex',
    label: 'Sex',
    type: 'select',
    options: [
      { value: 1, label: 'Male' },
      { value: 0, label: 'Female' }
    ],
    icon: User,
    description: 'Biological sex',
    category: 'demographics'
  },
  {
    id: 'cp',
    label: 'Chest Pain Type',
    type: 'select',
    options: [
      { value: 1, label: 'Typical Angina' },
      { value: 2, label: 'Atypical Angina' },
      { value: 3, label: 'Non-Anginal Pain' },
      { value: 4, label: 'Asymptomatic' }
    ],
    icon: Heart,
    description: 'Type of chest pain experienced',
    category: 'symptoms'
  },
  {
    id: 'trestbps',
    label: 'Resting Blood Pressure',
    type: 'number',
    min: 50,
    max: 250,
    placeholder: 'e.g., 130',
    suffix: 'mm Hg',
    icon: Activity,
    description: 'Resting blood pressure measurement',
    category: 'vitals'
  },
  {
    id: 'chol',
    label: 'Serum Cholesterol',
    type: 'number',
    min: 100,
    max: 600,
    placeholder: 'e.g., 240',
    suffix: 'mg/dl',
    icon: Droplets,
    description: 'Serum cholesterol level',
    category: 'vitals'
  },
  {
    id: 'fbs',
    label: 'Fasting Blood Sugar',
    type: 'select',
    options: [
      { value: 1, label: '> 120 mg/dl (True)' },
      { value: 0, label: '<= 120 mg/dl (False)' }
    ],
    icon: Thermometer,
    description: 'Fasting blood sugar > 120 mg/dl',
    category: 'vitals'
  },
  {
    id: 'restecg',
    label: 'Resting ECG',
    type: 'select',
    options: [
      { value: 0, label: 'Normal' },
      { value: 1, label: 'ST-T Abnormality' },
      { value: 2, label: 'Left Ventricular Hypertrophy' }
    ],
    icon: ActivitySquare,
    description: 'Resting electrocardiographic results',
    category: 'cardiac'
  },
  {
    id: 'thalach',
    label: 'Max Heart Rate',
    type: 'number',
    min: 50,
    max: 250,
    placeholder: 'e.g., 150',
    suffix: 'bpm',
    icon: HeartPulse,
    description: 'Maximum heart rate achieved during exercise',
    category: 'cardiac'
  },
  {
    id: 'exang',
    label: 'Exercise Angina',
    type: 'select',
    options: [
      { value: 1, label: 'Yes' },
      { value: 0, label: 'No' }
    ],
    icon: AlertCircle,
    description: 'Exercise-induced angina',
    category: 'symptoms'
  },
  {
    id: 'oldpeak',
    label: 'ST Depression',
    type: 'number',
    min: 0,
    max: 10,
    step: 0.1,
    placeholder: 'e.g., 2.3',
    suffix: 'mm',
    icon: TrendingUp,
    description: 'ST depression induced by exercise',
    category: 'cardiac'
  },
  {
    id: 'slope',
    label: 'ST Slope',
    type: 'select',
    options: [
      { value: 1, label: 'Upsloping' },
      { value: 2, label: 'Flat' },
      { value: 3, label: 'Downsloping' }
    ],
    icon: LineChart,
    description: 'Slope of peak exercise ST segment',
    category: 'cardiac'
  },
  {
    id: 'ca',
    label: 'Major Vessels',
    type: 'number',
    min: 0,
    max: 3,
    placeholder: 'e.g., 0',
    suffix: 'vessels',
    icon: Zap,
    description: 'Number of major vessels colored by fluoroscopy',
    category: 'cardiac'
  },
  {
    id: 'thal',
    label: 'Thalassemia',
    type: 'select',
    options: [
      { value: 3, label: 'Normal' },
      { value: 6, label: 'Fixed Defect' },
      { value: 7, label: 'Reversible Defect' }
    ],
    icon: Stethoscope,
    description: 'Thalassemia blood disorder status',
    category: 'blood'
  }
]

const categories = {
  demographics: 'Demographics',
  vitals: 'Vital Signs',
  symptoms: 'Symptoms',
  cardiac: 'Cardiac Markers',
  blood: 'Blood Work'
}

export default function PredictionPage() {
  const [formData, setFormData] = useState({})
  const [activeCategory, setActiveCategory] = useState('demographics')
  const { predict, explain, loading } = usePrediction()
  const navigate = useNavigate()

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Convert all values to numbers
    const numericData = {}
    Object.keys(formData).forEach(key => {
      numericData[key] = Number(formData[key])
    })

    try {
      await predict(numericData)
      await explain(numericData)
      navigate('/result')
    } catch (err) {
      console.error('Prediction failed:', err)
    }
  }

  const isComplete = formFields.every(field => formData[field.id] !== undefined && formData[field.id] !== '')
  const progress = (Object.keys(formData).length / formFields.length) * 100

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Neural Diagnosis</h1>
              <p className="text-sm text-metallic">Enter patient clinical parameters for AI analysis</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-metallic">Completion</span>
              <span className="text-neon-green font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-green to-amber-gold rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-2">
              {Object.entries(categories).map(([key, label]) => {
                const count = formFields.filter(f => f.category === key && formData[f.id] !== undefined).length
                const total = formFields.filter(f => f.category === key).length
                const isActive = activeCategory === key

                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                      isActive 
                        ? 'bg-neon-green/10 border border-neon-green/20 text-white' 
                        : 'text-metallic hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-medium">{label}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                      count === total ? 'bg-neon-green/20 text-neon-green' : 'bg-white/5 text-metallic'
                    }`}>
                      {count}/{total}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-8 mb-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-neon-green" />
                      </span>
                      {categories[activeCategory]}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      {formFields
                        .filter(field => field.category === activeCategory)
                        .map((field, index) => {
                          const Icon = field.icon
                          return (
                            <motion.div
                              key={field.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="space-y-2"
                            >
                              <label className="flex items-center gap-2 text-sm font-medium text-metallic-light">
                                <Icon className="w-4 h-4 text-neon-green/60" />
                                {field.label}
                                {field.suffix && (
                                  <span className="text-xs text-metallic/50">({field.suffix})</span>
                                )}
                              </label>

                              {field.type === 'select' ? (
                                <select
                                  value={formData[field.id] || ''}
                                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  className="input-futuristic appearance-none cursor-pointer"
                                >
                                  <option value="" className="bg-graphite">Select...</option>
                                  {field.options.map(opt => (
                                    <option key={opt.value} value={opt.value} className="bg-graphite">
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <div className="relative">
                                  <input
                                    type={field.type}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step || 1}
                                    value={formData[field.id] || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="input-futuristic"
                                  />
                                  {field.suffix && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-metallic/50">
                                      {field.suffix}
                                    </span>
                                  )}
                                </div>
                              )}

                              <p className="text-xs text-metallic/50">{field.description}</p>
                            </motion.div>
                          )
                        })}
                    </div>
                  </GlassCard>
                </motion.div>
              </AnimatePresence>

              {/* Navigation & Submit */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {Object.keys(categories).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeCategory === cat ? 'bg-neon-green w-6' : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-4">
                  {Object.keys(categories).indexOf(activeCategory) > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const keys = Object.keys(categories)
                        const idx = keys.indexOf(activeCategory)
                        setActiveCategory(keys[idx - 1])
                      }}
                      className="px-6 py-3 rounded-xl border border-white/10 text-metallic hover:text-white hover:bg-white/5 transition-all"
                    >
                      Previous
                    </button>
                  )}

                  {Object.keys(categories).indexOf(activeCategory) < Object.keys(categories).length - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        const keys = Object.keys(categories)
                        const idx = keys.indexOf(activeCategory)
                        setActiveCategory(keys[idx + 1])
                      }}
                      className="px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={!isComplete || loading}
                      whileHover={isComplete ? { scale: 1.05 } : {}}
                      whileTap={isComplete ? { scale: 0.95 } : {}}
                      className={`px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 ${
                        isComplete 
                          ? 'btn-primary' 
                          : 'bg-white/5 text-metallic cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5" />
                          Run Neural Analysis
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}