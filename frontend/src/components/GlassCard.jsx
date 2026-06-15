import React from 'react'
import { motion } from 'framer-motion'

export default function GlassCard({ 
  children, 
  className = '', 
  delay = 0,
  hover3D = true,
  glowColor = 'rgba(0, 255, 136, 0.1)'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover3D ? { 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      } : {}}
      className={`glass-card ${className}`}
      style={{
        '--glow-color': glowColor
      }}
    >
      {children}
    </motion.div>
  )
}