'use client'

import { useEffect, useRef, Suspense, useState, useMemo } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/watch-compressed.glb', '/draco/')
gsap.registerPlugin(ScrollTrigger)

function SplitWatch({
  caseColorLeft,
  strapColorLeft,
  caseColorRight,
  strapColorRight,
  splitPosition
}: any) {

  const { scene } = useGLTF('/models/watch-compressed.glb', '/draco/')

  const leftScene = useMemo(() => scene.clone(), [scene])
  const rightScene = useMemo(() => scene.clone(), [scene])

  const meshesLeft = useRef<THREE.Mesh[]>([])
  const meshesRight = useRef<THREE.Mesh[]>([])

  useEffect(() => {

    leftScene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        meshesLeft.current.push(child)
      }
    })

    rightScene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        meshesRight.current.push(child)
      }
    })

  }, [leftScene, rightScene])


  useEffect(() => {

    meshesLeft.current.forEach((mesh) => {

      if (!Array.isArray(mesh.material) && mesh.material.name === 'Green') {

        const material = mesh.material as THREE.MeshStandardMaterial
        material.color.set(caseColorLeft)

        material.metalness =
          caseColorLeft !== '#2C2C2C' ? 1 : 0.6

        material.roughness =
          caseColorLeft !== '#2C2C2C' ? 0.1 : 0.4
      }

      if (!Array.isArray(mesh.material) && mesh.material.name === 'DarkPins.001') {
        (mesh.material as THREE.MeshStandardMaterial).color.set(strapColorLeft)
      }

    })

  }, [caseColorLeft, strapColorLeft])


  useEffect(() => {

    meshesRight.current.forEach((mesh) => {

      if (!Array.isArray(mesh.material) && mesh.material.name === 'Green') {

        const material = mesh.material as THREE.MeshStandardMaterial
        material.color.set(caseColorRight)

        material.metalness =
          caseColorRight !== '#2C2C2C' ? 1 : 0.6

        material.roughness =
          caseColorRight !== '#2C2C2C' ? 0.1 : 0.4
      }

      if (!Array.isArray(mesh.material) && mesh.material.name === 'DarkPins.001') {
        (mesh.material as THREE.MeshStandardMaterial).color.set(strapColorRight)
      }

    })

  }, [caseColorRight, strapColorRight])


  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.12}>

      <group>

        <primitive object={leftScene} scale={4.5} />

        <mesh position={[splitPosition, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="black" side={THREE.DoubleSide} />
        </mesh>

      </group>

      <group>

        <primitive object={rightScene} scale={4.5} />

        <mesh position={[splitPosition - 100, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="black" side={THREE.DoubleSide} />
        </mesh>

      </group>

    </Float>
  )
}

export default function ComparisonSlider() {

  const sectionRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const [sliderPosition, setSliderPosition] = useState(50)

  const leftConfig = { case: '#FFD700', strap: '#8B4513', name: 'Gold + Brown' }
  const rightConfig = { case: '#2C2C2C', strap: '#1E3A5F', name: 'Carbon + Navy' }

  useEffect(() => {

    const ctx = gsap.context(() => {

      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1
        },
        opacity: 0,
        y: 100
      })

    })

    return () => ctx.revert()

  }, [])


  const handleMove = (clientX: number) => {

    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()

    const percentage =
      ((clientX - rect.left) / rect.width) * 100

    setSliderPosition(
      Math.max(0, Math.min(100, percentage))
    )

  }


  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white py-32 md:py-40"
    >

      <div className="container-custom">

        {/* Header */}

        <div className="text-center mb-20 max-w-3xl mx-auto">

          <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase block mb-6">
            Compare Styles
          </span>

          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            See the difference
          </h2>

          <p className="text-lg text-white/40 mt-8">
            Slide across the watch to explore how materials
            transform its character.
          </p>

        </div>


        {/* Slider */}

        <div
          ref={sliderRef}
          onMouseMove={(e) => handleMove(e.clientX)}
          className="relative w-full h-130 md:h-175 rounded-4xl overflow-hidden border border-white/10 bg-linear-to-b from-zinc-900/20 to-black shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
        >

          <Canvas
            frameloop="demand"
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 12], fov: 50 }}
            gl={{ powerPreference: 'high-performance' }}
          >

            <color attach="background" args={['#0a0a0a']} />

            <ambientLight intensity={0.35} />

            <spotLight
              position={[10, 10, 10]}
              intensity={2}
            />

            <spotLight
              position={[-10, -10, -10]}
              intensity={0.8}
              color="#4a6fa5"
            />

            <Environment preset="studio" resolution={128} />

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
            className="absolute top-0 bottom-0 w-0.5 bg-white/80"
            style={{ left: `${sliderPosition}%` }}
          >

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-18 h-18 rounded-full bg-white shadow-[0_10px_40px_rgba(255,255,255,0.25)] flex items-center justify-center">

              <span className="text-black text-lg">↔</span>

            </div>

          </div>


          {/* Labels */}

          <div className="absolute bottom-10 left-10 bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">

            <span className="text-xs text-white/40 block mb-1 uppercase tracking-widest">
              Left
            </span>

            <span className="text-sm font-medium">
              {leftConfig.name}
            </span>

          </div>


          <div className="absolute bottom-10 right-10 text-right bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">

            <span className="text-xs text-white/40 block mb-1 uppercase tracking-widest">
              Right
            </span>

            <span className="text-sm font-medium">
              {rightConfig.name}
            </span>

          </div>

        </div>


        {/* CTA */}

        <div className="text-center mt-20">

          <p className="text-white/40 mb-8">
            This is just two of sixteen possible combinations.
          </p>

          <Link
            href="/editor"
            className="inline-flex items-center px-10 py-4 rounded-full bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition"
          >
            Launch Configurator →
          </Link>

        </div>

      </div>

    </section>
  )
}