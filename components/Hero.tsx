'use client'

import { useEffect, useRef, Suspense, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Float, Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

useGLTF.preload('/models/watch-compressed.glb', '/draco/')

const CONFIGS = [
  { case: '#FFD700', strap: '#8B4513', name: 'Executive' },
  { case: '#C0C0C0', strap: '#1E3A5F', name: 'Minimalist' },
  { case: '#B76E79', strap: '#2C2416', name: 'Heritage' },
  { case: '#2C2C2C', strap: '#D2B48C', name: 'Adventurer' },
]

function MorphingWatch({ configIndex }: { configIndex: number }) {
  const { scene } = useGLTF('/models/watch-compressed.glb', '/draco/')
  const groupRef = useRef<THREE.Group>(null)

  const meshes = useRef<THREE.Mesh[]>([])

  // Cache meshes once
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) meshes.current.push(child)
    })
  }, [scene])

  // Animate material colors
  useEffect(() => {
    const config = CONFIGS[configIndex]
    const caseColor = new THREE.Color(config.case)
    const strapColor = new THREE.Color(config.strap)

    meshes.current.forEach((mesh) => {
      const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
      
      if (material.name === 'Green') {
        gsap.to((material as THREE.MeshStandardMaterial).color, {
          r: caseColor.r,
          g: caseColor.g,
          b: caseColor.b,
          duration: 1.4,
          ease: 'power2.inOut',
        })
      }

      if (material.name === 'DarkPins.001') {
        gsap.to((material as THREE.MeshStandardMaterial).color, {
          r: strapColor.r,
          g: strapColor.g,
          b: strapColor.b,
          duration: 1.4,
          ease: 'power2.inOut',
        })
      }
    })
  }, [configIndex])

  // Subtle rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.15) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.25}>
        <primitive object={scene} scale={2.6} />
      </Float>
    </group>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const [configIndex, setConfigIndex] = useState(0)

  // Auto morph configs
  useEffect(() => {
    const interval = setInterval(() => {
      setConfigIndex((prev) => (prev + 1) % CONFIGS.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 70,
        duration: 1.6,
        delay: 0.4,
        ease: 'power3.out',
      })

      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: false,
        },
        opacity: 0.35,
        scale: 0.96,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black will-change-transform"
    >
      {/* Depth gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-black to-zinc-900" />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          className="w-full h-full"
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#0a0a0a']} />

          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />

          <ambientLight intensity={0.3} />

          <spotLight
            position={[12, 12, 10]}
            angle={0.25}
            penumbra={1}
            intensity={2}
          />

          <spotLight
            position={[-10, -10, -10]}
            angle={0.25}
            penumbra={1}
            intensity={0.7}
            color="#4a6fa5"
          />

          <Environment preset="studio" resolution={64} />

          <Suspense fallback={null}>
            <MorphingWatch configIndex={configIndex} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div
        ref={titleRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none"
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-px bg-white/10" />

          <span className="text-[10px] tracking-[0.4em] text-white/30 uppercase font-mono">
            One Watch · Infinite You
          </span>

          <div className="w-16 h-px bg-white/10" />
        </div>

        {/* Title */}
        <h1
          className="text-[14vw] md:text-[11vw] lg:text-[9vw] leading-none tracking-tight font-light"
          style={{
            fontFamily: 'var(--font-serif)',
            textShadow: '0 20px 60px rgba(255,255,255,0.15)',
          }}
        >
          ATELIER
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white/50 font-light mt-8 tracking-[0.15em]">
          Precision Engineering · Swiss Made
        </p>

        {/* Config indicator */}
        <div className="mt-12 px-6 py-2 text-xs font-mono uppercase text-white/70 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
          Now showing:{' '}
          <span className="text-white">
            {CONFIGS[configIndex].name}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 pointer-events-none">
        <span className="text-[9px] font-mono tracking-[0.45em] text-white/20 uppercase">
          Explore
        </span>

        <div className="relative w-px h-20 bg-white/5 overflow-hidden">
          <div
            className="absolute top-0 w-full h-10 bg-linear-to-b from-white/40 to-transparent"
            style={{
              animation: 'scroll 2.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0%, 20% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          80%, 100% {
            transform: translateY(200%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}