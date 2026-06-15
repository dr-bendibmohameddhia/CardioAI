import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

function HeartShape({ color = '#00ff88', scale = 1, distort = 0.3 }) {
  const meshRef = useRef()

  // Create heart geometry using parametric equations
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const vertices = []
    const indices = []
    const resolution = 64

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const u = (i / resolution) * Math.PI * 2
        const v = (j / resolution) * Math.PI

        // Heart parametric equations (modified sphere)
        const x = 16 * Math.pow(Math.sin(u), 3)
        const y = 13 * Math.cos(u) - 5 * Math.cos(2*u) - 2 * Math.cos(3*u) - Math.cos(4*u)
        const z = 0

        // Convert to spherical-like 3D
        const r = 1 + 0.3 * Math.sin(3*u) * Math.cos(2*v)
        const px = r * Math.sin(v) * Math.cos(u) * 0.8
        const py = r * Math.sin(v) * Math.sin(u) * 0.8 + 0.2
        const pz = r * Math.cos(v) * 0.8

        vertices.push(px, py, pz)
      }
    }

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const a = i * (resolution + 1) + j
        const b = a + 1
        const c = a + resolution + 1
        const d = c + 1
        indices.push(a, b, c, b, d, c)
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} geometry={geometry} scale={scale}>
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

function PulseRing({ radius = 2, color = '#00ff88' }) {
  const ringRef = useRef()

  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      ringRef.current.scale.set(scale, scale, scale)
      ringRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.05, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Particles({ count = 100 }) {
  const particlesRef = useRef()

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#00ff88" transparent opacity={0.6} />
    </points>
  )
}

export default function Heart3D({ riskLevel = 'low' }) {
  const colorMap = {
    low: '#22c55e',
    moderate: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
    default: '#00ff88'
  }

  const color = colorMap[riskLevel] || colorMap.default

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color={color} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
        <Environment preset="city" />

        <HeartShape color={color} scale={1.2} distort={0.4} />
        <PulseRing radius={2.2} color={color} />
        <PulseRing radius={2.8} color={color} />
        <Particles count={200} />

        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={1}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}