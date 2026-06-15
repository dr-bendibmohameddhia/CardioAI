import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, TrendingUp, TrendingDown, Users, 
  Activity, Heart, Brain, Calendar, Filter, Download
} from 'lucide-react'
import { usePrediction } from '../hooks/usePrediction'
import GlassCard from '../components/GlassCard'
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts'

// Mock data for dashboard visualization
const mockHistoryData = [
  { date: '2026-01-15', risk: 0.23, prediction: 0 },
  { date: '2026-02-03', risk: 0.67, prediction: 1 },
  { date: '2026-02-20', risk: 0.15, prediction: 0 },
  { date: '2026-03-10', risk: 0.82, prediction: 1 },
  { date: '2026-03-25', risk: 0.34, prediction: 0 },
  { date: '2026-04-12', risk: 0.56, prediction: 1 },
  { date: '2026-05-01', risk: 0.12, prediction: 0 },
  { date: '2026-05-18', risk: 0.71, prediction: 1 },
  { date: '2026-06-05', risk: 0.28, prediction: 0 },
  { date: '2026-06-15', risk: 0.45, prediction: 0 },
]

const riskDistribution = [
  { name: 'Low Risk', value: 45, color: '#22c55e' },
  { name: 'Moderate', value: 25, color: '#f59e0b' },
  { name: 'High Risk', value: 20, color: '#f97316' },
  { name: 'Critical', value: 10, color: '#ef4444' },
]

const featureImportance = [
  { feature: 'ca', importance: 0.18 },
  { feature: 'thal', importance: 0.16 },
  { feature: 'oldpeak', importance: 0.14 },
  { feature: 'cp', importance: 0.12 },
  { feature: 'thalach', importance: 0.10 },
  { feature: 'age', importance: 0.08 },
  { feature: 'chol', importance: 0.07 },
  { feature: 'trestbps', importance: 0.06 },
  { feature: 'exang', importance: 0.05 },
  { feature: 'slope', importance: 0.04 },
]

const modelPerformance = [
  { model: 'XGBoost', accuracy: 0.942, precision: 0.938, recall: 0.951, f1: 0.944 },
  { model: 'Random Forest', accuracy: 0.918, precision: 0.912, recall: 0.928, f1: 0.920 },
  { model: 'Logistic Reg', accuracy: 0.885, precision: 0.872, recall: 0.901, f1: 0.886 },
]

export default function DashboardPage() {
  const { patientHistory } = usePrediction()
  const [timeRange, setTimeRange] = useState('all')

  const totalScans = patientHistory.length + mockHistoryData.length
  const positiveCases = [...patientHistory, ...mockHistoryData].filter(p => p.prediction === 1 || p.risk > 0.5).length
  const avgRisk = [...patientHistory, ...mockHistoryData].reduce((acc, p) => acc + (p.risk || p.probability || 0), 0) / totalScans

  const history = patientHistory.length > 0 
    ? [...mockHistoryData, ...patientHistory.map(p => ({
        date: new Date(p.timestamp).toISOString().split('T')[0],
        risk: p.result.probability,
        prediction: p.result.prediction
      }))]
    : mockHistoryData

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-gold/10 border border-amber-gold/20 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-amber-gold" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-sm text-metallic">Real-time insights from neural predictions</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input-futuristic text-sm py-2"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button className="p-2 rounded-lg border border-white/10 text-metallic hover:text-white hover:bg-white/5 transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <GlassCard delay={0} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-neon-green" />
              </div>
              <span className="text-xs text-neon-green font-mono bg-neon-green/10 px-2 py-1 rounded">+12%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalScans}</div>
            <div className="text-sm text-metallic">Total Scans</div>
          </GlassCard>

          <GlassCard delay={0.1} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-xs text-red-400 font-mono bg-red-500/10 px-2 py-1 rounded">-5%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{positiveCases}</div>
            <div className="text-sm text-metallic">Positive Cases</div>
          </GlassCard>

          <GlassCard delay={0.2} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-gold/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-gold" />
              </div>
              <span className="text-xs text-amber-gold font-mono bg-amber-gold/10 px-2 py-1 rounded">Avg</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{(avgRisk * 100).toFixed(1)}%</div>
            <div className="text-sm text-metallic">Average Risk</div>
          </GlassCard>

          <GlassCard delay={0.3} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-warm-cyan/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-warm-cyan" />
              </div>
              <span className="text-xs text-warm-cyan font-mono bg-warm-cyan/10 px-2 py-1 rounded">94.2%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">XGBoost</div>
            <div className="text-sm text-metallic">Best Model</div>
          </GlassCard>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Trend */}
          <GlassCard className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-neon-green" />
                <h3 className="font-bold text-white">Risk Trend Over Time</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-metallic">
                <span className="w-2 h-2 rounded-full bg-neon-green" /> Low
                <span className="w-2 h-2 rounded-full bg-amber-gold" /> Moderate
                <span className="w-2 h-2 rounded-full bg-red-400" /> High
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} domain={[0, 1]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#12121a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#00ff88" 
                    strokeWidth={2}
                    fill="url(#riskGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Risk Distribution */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-5 h-5 text-amber-gold" />
              <h3 className="font-bold text-white">Risk Distribution</h3>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#12121a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-metallic">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Feature Importance */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-5 h-5 text-warm-cyan" />
              <h3 className="font-bold text-white">Feature Importance (XGBoost)</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportance} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <YAxis 
                    type="category" 
                    dataKey="feature" 
                    stroke="rgba(255,255,255,0.5)" 
                    fontSize={11}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#12121a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="importance" radius={[0, 4, 4, 0]} fill="#00e5ff" fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Model Comparison */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-neon-green" />
              <h3 className="font-bold text-white">Model Performance Comparison</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelPerformance} margin={{ top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="model" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} domain={[0.8, 1]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#12121a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend 
                    formatter={(value) => <span className="text-xs text-metallic">{value}</span>}
                  />
                  <Bar dataKey="accuracy" fill="#00ff88" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="precision" fill="#ffb700" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recall" fill="#00e5ff" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="f1" fill="#ff6b6b" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Patient History Table */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-metallic" />
              <h3 className="font-bold text-white">Recent Predictions</h3>
            </div>
            <button className="text-sm text-neon-green hover:text-neon-green-dim transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 px-4 text-xs font-medium text-metallic uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-metallic uppercase tracking-wider">Age</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-metallic uppercase tracking-wider">Cholesterol</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-metallic uppercase tracking-wider">Max HR</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-metallic uppercase tracking-wider">Risk</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-metallic uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(-10).reverse().map((record, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-white">{record.date}</td>
                    <td className="py-3 px-4 text-sm text-metallic-light">{record.data?.age || '54'}</td>
                    <td className="py-3 px-4 text-sm text-metallic-light">{record.data?.chol || '240'}</td>
                    <td className="py-3 px-4 text-sm text-metallic-light">{record.data?.thalach || '150'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${(record.risk || record.result?.probability || 0) * 100}%`,
                              backgroundColor: (record.risk || record.result?.probability || 0) > 0.5 ? '#ef4444' : '#22c55e'
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono text-metallic">
                          {((record.risk || record.result?.probability || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        (record.prediction || record.result?.prediction || 0) === 1
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {(record.prediction || record.result?.prediction || 0) === 1 ? 'Disease' : 'Healthy'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}