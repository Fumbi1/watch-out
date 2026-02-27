'use client'

import { useEffect, useRef, Suspense, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

function SplitWatch({
  caseColorLeft,
  strapColorLeft,
  caseColorRight,
  strapColorRight,
  splitPosition
}: {
  caseColorLeft: string
  strapColorLeft: string
  caseColorRight: string
  strapColorRight: string
  splitPosition: number
}) {
  const { scene } = useGLTF('/models/watch.glb')
  const leftScene = scene.clone()
  const rightScene = scene.clone()
  const groupRef = useRef<THREE.Group>(null)

  // Apply left materials
  useEffect(() => {
    leftScene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        if (child.material.name === 'Green') {
          child.material.color.set(caseColorLeft)
          child.material.metalness = caseColorLeft !== '#2C2C2C' ? 1.0 : 0.6
          child.material.roughness = caseColorLeft !== '#2C2C2C' ? 0.1 : 0.4
        }
        if (child.material.name === 'DarkPins.001') {
          child.material.color.set(strapColorLeft)
        }
      }
    })
  }, [caseColorLeft, strapColorLeft, leftScene])

  // Apply right materials
  useEffect(() => {
    rightScene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        if (child.material.name === 'Green') {
          child.material.color.set(caseColorRight)
          child.material.metalness = caseColorRight !== '#2C2C2C' ? 1.0 : 0.6
          child.material.roughness = caseColorRight !== '#2C2C2C' ? 0.1 : 0.4
        }
        if (child.material.name === 'DarkPins.001') {
          child.material.color.set(strapColorRight)
        }
      }
    })
  }, [caseColorRight, strapColorRight, rightScene])

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
        {/* Left half - clipped */}
        <group>
          <primitive object={leftScene} scale={5.5} />
          <mesh position={[splitPosition, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial color="black" side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Right half - clipped */}
        <group>
          <primitive object={rightScene} scale={5.5} />
          <mesh position={[splitPosition - 100, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial color="black" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </Float>
    </group>
  )
}

export default function ComparisonSlider() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  // Configurations to compare
  const leftConfig = { case: '#FFD700', strap: '#8B4513', name: 'Gold + Brown' }
  const rightConfig = { case: '#2C2C2C', strap: '#1E3A5F', name: 'Carbon + Navy' }

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  useEffect(() => {
    gsap.from(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'top 40%',
        scrub: true,
      },
      opacity: 0,
      y: 100,
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black text-white py-24 md:py-32"
    >
      <div className="container-custom relative z-10">

        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase block mb-6">
            Compare Styles
          </span>
          <h2
            className="text-5xl md:text-7xl font-light tracking-tighter leading-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            See the difference
          </h2>
          <p className="text-base md:text-lg text-white/40 font-light mt-6 max-w-2xl mx-auto">
            Drag the slider to compare configurations.
            Every detail transforms the character.
          </p>
        </div>

        {/* Comparison Container */}
        <div
          ref={sliderRef}
          className="relative w-full h-125 md:h-175 bg-linear-to-b from-gray-900/20 to-black rounded-3xl overflow-hidden border border-white/5 cursor-ew-resize"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* 3D Canvas */}
          <Canvas
            frameloop="demand"
            dpr={[1, 2]}
            camera={{ position: [0, 0, 12], fov: 50 }}
          >
            <color attach="background" args={['#0a0a0a']} />
            <ambientLight intensity={0.3} />
            <spotLight position={[10, 10, 10]} intensity={2} />
            <spotLight position={[-10, -10, -10]} intensity={0.8} color="#4a6fa5" />
            <Environment preset="studio" resolution={256} />
            <Suspense fallback={null}>
              <SplitWatch
                caseColorLeft={leftConfig.case}
                strapColorLeft={leftConfig.strap}
                caseColorRight={rightConfig.case}
                strapColorRight={rightConfig.strap}
                splitPosition={(sliderPosition - 50) * 0.1}
              />
            </Suspense>
          </Canvas>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white/80 pointer-events-none z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Slider handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-black shadow-2xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-black">
                <path d="M8 9l4-4 4 4M8 15l4 4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider block mb-1">
              Left
            </span>
            <span className="text-sm font-medium text-white">
              {leftConfig.name}
            </span>
          </div>

          <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 text-right">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider block mb-1">
              Right
            </span>
            <span className="text-sm font-medium text-white">
              {rightConfig.name}
            </span>
          </div>

          {/* Instruction hint */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
            <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
              Drag to compare
            </span>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-16">
          <p className="text-sm text-white/40 font-light mb-6">
            This is just two of sixteen possible combinations
          </p>
          <button className="btn-primary">
            Explore All Options
          </button>
        </div>

      </div>
    </section>
  )
}