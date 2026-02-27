'use client'

import { useEffect, useRef, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, Environment, ContactShadows } from '@react-three/drei'
import { useRouter } from 'next/navigation'

gsap.registerPlugin(ScrollTrigger)

function HeroWatch() {
  const { scene } = useGLTF('/models/watch.glb')
  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.2}>
      <primitive object={scene} scale={6} />
    </Float>
  )
}

export default function ConfiguratorCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    gsap.from(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'top 30%',
        scrub: true,
      },
      opacity: 0,
      scale: 0.95,
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-linear-to-b from-black via-gray-900/20 to-black text-white flex items-center py-24 md:py-32"
    >
      {/* Background word */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        <span className="text-[30vw] font-light text-white/1 tracking-tighter whitespace-nowrap">
          YOURS
        </span>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* 3D Watch */}
          <div className="h-125 md:h-175 order-2 lg:order-1">
            <Canvas
              frameloop="demand"
              dpr={[1, 2]}
              camera={{ position: [5, 2, 10], fov: 50 }}
            >
              <color attach="background" args={['transparent']} />
              <ambientLight intensity={0.3} />
              <spotLight position={[10, 10, 10]} intensity={2} castShadow />
              <spotLight position={[-10, -10, -10]} intensity={0.8} color="#4a6fa5" />
              <Environment preset="apartment" resolution={256} />
              <Suspense fallback={null}>
                <HeroWatch />
              </Suspense>
              <ContactShadows
                position={[0, -3, 0]}
                opacity={0.3}
                scale={15}
                blur={2.5}
                frames={1}
                resolution={128}
              />
            </Canvas>
          </div>

          {/* Content */}
          <div className="space-y-10 order-1 lg:order-2">
            <div>
              <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase block mb-6">
                Your Turn
              </span>
              <h2
                className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Make it<br />
                <em className="italic text-white/60">yours</em>
              </h2>
            </div>

            <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light max-w-xl">
              Configure every detail. From case material to strap texture.
              Create a timepiece that reflects exactly who you are.
            </p>

            {/* Feature list */}
            <div className="space-y-6 pt-6">
              {[
                { icon: '◆', text: 'Real-time 3D preview as you customize' },
                { icon: '◆', text: 'Save and share your configurations' },
                { icon: '◆', text: 'Expert guidance at every step' },
                { icon: '◆', text: 'Order directly from configurator' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-white/20 mt-1">{item.icon}</span>
                  <span className="text-sm md:text-base text-white/60 font-light">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <button
                onClick={() => router.push('/editor')}
                className="btn-primary"
              >
                Launch Configurator
              </button>
              <button className="btn-secondary">
                Watch Tutorial
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-white/5">
              <div>
                <div className="text-2xl font-light text-white/90 mb-1">847</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                  Configured
                </div>
              </div>
              <div>
                <div className="text-2xl font-light text-white/90 mb-1">4.9</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                  Satisfaction
                </div>
              </div>
              <div>
                <div className="text-2xl font-light text-white/90 mb-1">14d</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                  Delivery
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 right-1/4 w-150 h-150 bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
    </section>
  )
}