import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSphere({ color, probability }) {
  const sphereRef = useRef()
  const speed = 0.5 + probability * 2

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += speed * 0.01
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.2
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05 * probability
      sphereRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        color={color}
        distort={0.4 + probability * 0.3}
        speed={2 + probability * 3}
        roughness={0.1}
        metalness={0.9}
        emissive={color}
        emissiveIntensity={0.3 + probability * 0.4}
      />
    </Sphere>
  )
}

function Ring({ radius, color, speed = 1 }) {
  const ringRef = useRef()

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed * 0.5
      const scale = 1 + Math.sin(state.clock.elapsedTime * speed) * 0.02
      ringRef.current.scale.set(scale, scale, 1)
    }
  })

  return (
    <mesh ref={ringRef} rotation={[0, 0, 0]}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  )
}

export default function RiskSphere({ probability, riskLevel }) {
  const colorMap = {
    low: '#22c55e',
    moderate: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444'
  }

  const color = colorMap[riskLevel] || '#00ff88'

  return (
    <div className="w-full h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} color={color} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />

        <AnimatedSphere color={color} probability={probability} />
        <Ring radius={2} color={color} speed={1} />
        <Ring radius={2.5} color={color} speed={0.7} />
        <Ring radius={3} color={color} speed={0.5} />
      </Canvas>

      {/* Overlay percentage */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-6xl font-bold text-white" style={{ textShadow: `0 0 30px ${color}` }}>
            {(probability * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-metallic uppercase tracking-widest mt-2">
            Risk Probability
          </div>
        </div>
      </div>
    </div>
  )
}