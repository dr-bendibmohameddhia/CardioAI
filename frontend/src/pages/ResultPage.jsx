import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Heart, AlertTriangle, CheckCircle, 
  Brain, BarChart3, ArrowRight, Download, Share2
} from 'lucide-react'
import { usePrediction } from '../hooks/usePrediction'
import RiskSphere from '../components/RiskSphere'
import GlassCard from '../components/GlassCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function ResultPage() {
  const { predictionData, explanationData, clearPrediction } = usePrediction()
  const navigate = useNavigate()

  useEffect(() => {
    if (!predictionData) {
      navigate('/predict')
    }
  }, [predictionData, navigate])

  if (!predictionData || !explanationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-metallic">Loading results...</p>
        </div>
      </div>
    )
  }

  const { prediction, probability, risk_level, risk_color, confidence, message } = predictionData
  const { shap_values, top_positive_features, top_negative_features, summary } = explanationData

  const riskKey = risk_level.toLowerCase().replace(' risk', '').replace(' ', '')

  // Prepare SHAP chart data
  const shapChartData = shap_values.slice(0, 10).map(sv => ({
    feature: sv.feature,
    impact: Math.abs(sv.shap_value),
    direction: sv.shap_value > 0 ? 'positive' : 'negative',
    raw: sv.shap_value
  }))

  const getRiskIcon = () => {
    if (prediction === 0) return <CheckCircle className="w-8 h-8 text-risk-low" />
    if (probability < 0.6) return <AlertTriangle className="w-8 h-8 text-risk-moderate" />
    return <Heart className="w-8 h-8 text-risk-critical" />
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => { clearPrediction(); navigate('/predict') }}
              className="p-2 rounded-lg border border-white/10 text-metallic hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Analysis Results</h1>
              <p className="text-sm text-metallic">Neural prediction with SHAP explainability</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="p-3 rounded-xl border border-white/10 text-metallic hover:text-white hover:bg-white/5 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl border border-white/10 text-metallic hover:text-white hover:bg-white/5 transition-all">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Risk Visualization */}
          <div className="space-y-6">
            <GlassCard className="p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {getRiskIcon()}
                    <div>
                      <h2 className="text-xl font-bold text-white">Risk Assessment</h2>
                      <p className="text-sm text-metallic">{confidence}</p>
                    </div>
                  </div>
                  <div 
                    className="px-4 py-2 rounded-full text-sm font-bold border"
                    style={{ 
                      color: risk_color, 
                      borderColor: `${risk_color}40`,
                      backgroundColor: `${risk_color}10`
                    }}
                  >
                    {risk_level}
                  </div>
                </div>

                <RiskSphere probability={probability} riskLevel={riskKey} />

                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-white text-sm leading-relaxed">{message}</p>
                </div>
              </div>
            </GlassCard>

            {/* Summary Card */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-neon-green" />
                <h3 className="font-bold text-white">AI Summary</h3>
              </div>
              <p className="text-metallic-light text-sm leading-relaxed">{summary}</p>
            </GlassCard>
          </div>

          {/* Right - SHAP Explanations */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-amber-gold" />
                <h3 className="font-bold text-white">Feature Impact Analysis</h3>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shapChartData} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <YAxis 
                      type="category" 
                      dataKey="feature" 
                      stroke="rgba(255,255,255,0.5)" 
                      fontSize={11}
                      width={70}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#12121a', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                      {shapChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.direction === 'positive' ? '#ef4444' : '#22c55e'}
                          fillOpacity={0.8}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500/80" />
                  <span className="text-metallic">Increases Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500/80" />
                  <span className="text-metallic">Decreases Risk</span>
                </div>
              </div>
            </GlassCard>

            {/* Top Features */}
            <div className="grid grid-cols-2 gap-4">
              <GlassCard className="p-5">
                <h4 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Factors
                </h4>
                <div className="space-y-3">
                  {top_positive_features.slice(0, 4).map((feat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-metallic-light">{feat.feature}</span>
                      <span className="text-xs font-mono text-red-400">
                        +{feat.impact.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <h4 className="text-sm font-bold text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Protective Factors
                </h4>
                <div className="space-y-3">
                  {top_negative_features.slice(0, 4).map((feat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-metallic-light">{feat.feature}</span>
                      <span className="text-xs font-mono text-green-400">
                        {feat.impact.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link to="/predict">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearPrediction}
              className="px-8 py-4 rounded-xl border border-white/10 text-metallic-light hover:text-white hover:bg-white/5 transition-all flex items-center gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              New Analysis
            </motion.button>
          </Link>

          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-3"
            >
              <BarChart3 className="w-5 h-5" />
              View Dashboard
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  )
}