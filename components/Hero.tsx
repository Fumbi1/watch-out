'use client'

import { useEffect, useRef, Suspense, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Float, Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)
useGLTF.preload('/models/watch.glb')

const CONFIGS = [
  { case: '#FFD700', strap: '#8B4513', name: 'Executive' },
  { case: '#C0C0C0', strap: '#1E3A5F', name: 'Minimalist' },
  { case: '#B76E79', strap: '#2C2416', name: 'Heritage' },
  { case: '#2C2C2C', strap: '#D2B48C', name: 'Adventurer' },
]

function MorphingWatch() {
  const { scene } = useGLTF('/models/watch.glb')
  const [configIndex, setConfigIndex] = useState(0)
  const groupRef = useRef<THREE.Group>(null)
  
  // Auto-morph through configurations
  useEffect(() => {
    const interval = setInterval(() => {
      setConfigIndex((prev) => (prev + 1) % CONFIGS.length)
    }, 4000) // Change every 4 seconds
    
    return () => clearInterval(interval)
  }, [])

  // Apply materials
  useEffect(() => {
    const config = CONFIGS[configIndex]
    
    scene.traverse((child: any) => {
      if (child.isMesh) {
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material.clone()
        }

        if (child.material.name === 'Green') {
          gsap.to(child.material.color, {
            r: new THREE.Color(config.case).r,
            g: new THREE.Color(config.case).g,
            b: new THREE.Color(config.case).b,
            duration: 1.5,
            ease: 'power2.inOut'
          })
        }

        if (child.material.name === 'DarkPins.001') {
          gsap.to(child.material.color, {
            r: new THREE.Color(config.strap).r,
            g: new THREE.Color(config.strap).g,
            b: new THREE.Color(config.strap).b,
            duration: 1.5,
            ease: 'power2.inOut'
          })
        }
      }
    })
  }, [configIndex, scene])

  // Gentle rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <primitive object={scene} scale={6} />
      </Float>
    </group>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const configNameRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial fade in
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 80,
        duration: 1.8,
        delay: 0.5,
        ease: 'power4.out'
      })

      // Parallax on scroll
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
        opacity: 0.3,
        scale: 0.95,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Gradient background */}


      {/* 3D Canvas */}
      <div className="absolute inset-0 w-full">
        <Canvas
        className="w-full h-full"
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={['#0a0a0a']} />
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
          
          <ambientLight intensity={0.25} />
          <spotLight position={[15, 15, 10]} angle={0.2} penumbra={1} intensity={2} />
          <spotLight position={[-10, -10, -10]} angle={0.25} penumbra={1} intensity={0.8} color="#4a6fa5" />
          
          <Environment preset="city" resolution={256} />
          
          <Suspense fallback={null}>
            <MorphingWatch />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div 
        ref={titleRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 container-custom"
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-px bg-white/10" />
          <span className="text-[10px] tracking-[0.4em] text-white/30 uppercase font-mono">
            One Watch · Infinite You
          </span>
          <div className="w-16 h-px bg-white/10" />
        </div>

        {/* Main title */}
        <h1
          className="text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none tracking-tighter font-light text-center"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          ATELIER
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white/40 font-light mt-6 tracking-wide">
          Precision Engineering · Swiss Made
        </p>

        {/* Current config indicator */}
        <div className="mt-12 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
          <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
            Now showing: <span ref={configNameRef} className="text-white">{CONFIGS[0].name}</span>
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4 pointer-events-none">
        <span className="text-[9px] font-mono tracking-[0.4em] text-white/20 uppercase">
          Explore
        </span>
        <div className="relative w-px h-20 bg-white/5 overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-white/40 to-transparent"
            style={{
              animation: 'scroll 2.5s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0%, 20% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          80%, 100% { transform: translateY(200%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}