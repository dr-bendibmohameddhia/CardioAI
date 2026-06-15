import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Shield, Zap, Activity, Heart, ChevronDown } from 'lucide-react'
import Heart3D from '../components/Heart3D'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'

const features = [
  {
    icon: Brain,
    title: 'Neural Prediction',
    description: 'Advanced XGBoost ensemble model trained on 300+ clinical parameters with 94.2% accuracy.',
    color: '#00ff88'
  },
  {
    icon: Shield,
    title: 'SHAP Explainability',
    description: 'Transparent AI decisions with feature-level explanations for every prediction.',
    color: '#ffb700'
  },
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Sub-second inference with production-grade FastAPI backend serving.',
    color: '#00e5ff'
  },
  {
    icon: Activity,
    title: 'Clinical Grade',
    description: 'Optimized for medical recall — minimizing false negatives in critical diagnosis.',
    color: '#ff6b6b'
  }
]

const stats = [
  { value: 303, suffix: '', label: 'Training Samples', color: '#00ff88' },
  { value: 94, suffix: '%', label: 'Model Accuracy', color: '#ffb700' },
  { value: 13, suffix: '', label: 'Clinical Features', color: '#00e5ff' },
  { value: 3, suffix: '', label: 'ML Models', color: '#ff6b6b' }
]

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-green/5 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
              </span>
              v2.0.6 — Production Ready
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Predict Heart Disease</span>
              <br />
              <span className="neon-text">With Neural AI</span>
            </h1>

            <p className="text-lg text-metallic-light/80 max-w-xl mb-10 leading-relaxed">
              CardioAI uses advanced machine learning to analyze clinical parameters 
              and predict heart disease risk with explainable, transparent results 
              trusted by medical professionals.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/predict">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-3 text-lg"
                >
                  <Heart className="w-5 h-5" />
                  Start Diagnosis
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl border border-white/10 text-metallic-light font-semibold hover:bg-white/5 hover:text-white transition-all duration-300 flex items-center gap-3"
                >
                  <Activity className="w-5 h-5" />
                  View Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right - 3D Heart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-radial from-neon-green/10 via-transparent to-transparent blur-3xl" />
            <Heart3D />

            {/* Floating stats */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 right-10 glass-panel px-4 py-3"
            >
              <div className="text-neon-green font-bold text-lg">94.2%</div>
              <div className="text-xs text-metallic">Accuracy</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-20 left-10 glass-panel px-4 py-3"
            >
              <div className="text-amber-gold font-bold text-lg">0.3s</div>
              <div className="text-xs text-metallic">Inference</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-metallic" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <GlassCard key={stat.label} delay={index * 0.1} className="p-8 text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: stat.color }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-metallic uppercase tracking-wider">{stat.label}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Powered by </span>
              <span className="neon-text">Advanced AI</span>
            </h2>
            <p className="text-metallic-light max-w-2xl mx-auto">
              Three ensemble models with SHAP explainability deliver clinical-grade predictions 
              you can trust and understand.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <GlassCard key={feature.title} delay={index * 0.15} className="p-8 group">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-metallic-light text-sm leading-relaxed">{feature.description}</p>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <GlassCard className="p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 via-amber-gold/5 to-warm-cyan/5" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to <span className="neon-text">Analyze</span>?
              </h2>
              <p className="text-metallic-light text-lg mb-10 max-w-xl mx-auto">
                Enter patient clinical data and receive an AI-powered heart disease risk assessment 
                with detailed explanations in seconds.
              </p>
              <Link to="/predict">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg flex items-center gap-3 mx-auto"
                >
                  <Heart className="w-5 h-5" />
                  Start Diagnosis Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-neon-green" />
            <span className="font-bold text-white">Cardio<span className="text-neon-green">AI</span></span>
          </div>
          <p className="text-sm text-metallic">
            © CardioAI. Built by BENDIB Mohamed Dhia for educational and portfolio purposes. Not for clinical use without FDA approval.
          </p>
        </div>
      </footer>
    </div>
  )
}