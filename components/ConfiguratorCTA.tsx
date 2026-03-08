'use client'

import { useEffect, useRef, Suspense, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, Environment, ContactShadows } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'

useGLTF.preload('/models/watch-compressed.glb', '/draco/')
gsap.registerPlugin(ScrollTrigger)

function HeroWatch() {
  const { scene } = useGLTF('/models/watch-compressed.glb', '/draco/')
  const watch = useMemo(() => scene.clone(), [scene])

  return (
    <Float speed={1.1} rotationIntensity={0.07} floatIntensity={0.18}>
      <primitive object={watch} scale={4.5} />
    </Float>
  )
}

export default function ConfiguratorCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'top 40%',
          scrub: 1
        },
        opacity: 0,
        scale: 0.96,
        duration: 1
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-linear-to-b from-black via-zinc-900/20 to-black text-white flex items-center py-32 md:py-40"
    >

      {/* Background word */}

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        <span className="text-[28vw] font-light text-white/2 tracking-tight whitespace-nowrap">
          YOURS
        </span>
      </div>


      <div className="container-custom relative z-10">

        <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-center">

          {/* 3D Watch */}

          <div className="h-130 md:h-180 order-2 lg:order-1 relative">

            <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full" />

            <Canvas
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
              frameloop="demand"
              dpr={[1, 1.5]}
              camera={{ position: [5, 2, 10], fov: 50 }}
            >

              <ambientLight intensity={0.35} />

              <spotLight
                position={[10, 10, 10]}
                intensity={2}
                castShadow
              />

              <spotLight
                position={[-10, -10, -10]}
                intensity={0.8}
                color="#4a6fa5"
              />

              <Environment preset="studio" resolution={128} />

              <Suspense fallback={null}>
                <HeroWatch />
              </Suspense>

              <ContactShadows
                position={[0, -3, 0]}
                opacity={0.35}
                scale={14}
                blur={2.5}
                frames={1}
                resolution={128}
              />

            </Canvas>

          </div>


          {/* Content */}

          <div className="space-y-12 order-1 lg:order-2">

            <div>

              <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase block mb-6">
                Your Turn
              </span>

              <h2
                className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Make it
                <br />
                <em className="italic text-white/60">yours</em>
              </h2>

            </div>


            <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light max-w-xl">
              Configure every detail — from case material to strap texture.
              Craft a timepiece that reflects exactly who you are.
            </p>


            {/* Feature list */}

            <div className="space-y-5 pt-4">

              {[
                'Real-time 3D preview while you customize',
                'Save and share your configurations',
                'Expert guidance at every step',
                'Order directly from the configurator'
              ].map((text, i) => (

                <div key={i} className="flex items-start gap-4">

                  <span className="text-white/20 mt-0.5">◆</span>

                  <span className="text-sm md:text-base text-white/60 font-light">
                    {text}
                  </span>

                </div>

              ))}

            </div>


            {/* CTA Buttons */}

            <div className="flex flex-col sm:flex-row gap-6 pt-6">

              <button
                onClick={() => router.push('/editor')}
                className="btn-primary"
              >
                Launch Configurator
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="btn-secondary"
              >
                Explore Materials
              </button>

            </div>


            {/* Trust indicators */}

            <div className="flex items-center gap-12 pt-10 border-t border-white/5">

              <div>
                <div className="text-3xl font-light text-white/90 mb-1">847</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                  Configured
                </div>
              </div>

              <div>
                <div className="text-3xl font-light text-white/90 mb-1">4.9</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                  Satisfaction
                </div>
              </div>

              <div>
                <div className="text-3xl font-light text-white/90 mb-1">14d</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                  Delivery
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}