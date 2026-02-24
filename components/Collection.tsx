'use client'

import { useEffect, useRef, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, Environment, ContactShadows } from '@react-three/drei'

gsap.registerPlugin(ScrollTrigger)

const WATCHES = [
  {
    id: '01',
    model: '/models/golden_watch.glb',
    title: 'Aurum',
    desc: 'Solid 18k gold case with a matching bracelet. The definition of timeless luxury.',
    color: '#1a1610',
    fov: 50,
    position: [0, 0, 20], 
  },
  {
    id: '02',
    model: '/models/luxury_watch.glb',
    title: 'Argent',
    desc: 'Brushed titanium finish. Lightweight, durable, and engineered for the modern era.',
    color: '#0a0f14',
    fov: 30,
    position: [0, 0, 10], 
  },
  {
    id: '03',
    model: '/models/citizen_watch.glb',
    title: 'Eclipse',
    desc: 'Rose gold accents on a midnight black dial. A statement of elegance.',
    color: '#140a0f',
    fov: 60,
    position: [0, 10, 40], 
  }
]

// Declarative R3F Component
function CollectionItem({ model }: { model: string }) {
  const { scene } = useGLTF(model)
  
  // Clone to ensure we can re-use the same GLB in multiple places if needed
  const sceneClone = scene.clone()

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={0.5} 
      floatingRange={[-0.2, 0.2]}
    >
      <primitive object={sceneClone} scale={2} rotation={[0, -0.5, 0]} />
    </Float>
  )
}

export default function Collection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      panelsRef.current.forEach((panel, i) => {
        if (!panel) return
        
        // DOM: Background Color Change
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => gsap.to(containerRef.current, { backgroundColor: WATCHES[i].color, duration: 0.8 }),
          onEnterBack: () => gsap.to(containerRef.current, { backgroundColor: WATCHES[i].color, duration: 0.8 })
        })

        // DOM: Text Reveal
        gsap.fromTo(panel.querySelectorAll('.anim-text'), 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.1, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 70%'
            }
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative bg-[#050505] transition-colors duration-700 ease-out">
      <div className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <h2 className="text-6xl md:text-8xl font-serif text-white mb-32 border-b border-white/10 pb-8">
          The Collection
        </h2>

        {WATCHES.map((watch, i) => (
          <div 
            key={i}
            ref={(el) => { if(el) panelsRef.current[i] = el }}
            className={`min-h-[80vh] flex flex-col md:flex-row items-center gap-12 md:gap-24 mb-32 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* R3F Canvas Area */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-[70vh] relative">
              <Canvas camera={{ position: watch.position as [number, number, number], fov: watch.fov }} dpr={[1, 2]}>
                <Environment preset="studio" />
                <Suspense fallback={null}>
                  <CollectionItem model={watch.model} />
                </Suspense>
                <ContactShadows position={[0, -2.5, 0]} opacity={0.5} blur={2.5} />
              </Canvas>
            </div>

            {/* DOM Text Area */}
            <div className="w-full md:w-1/2 space-y-6 z-10 text-white">
              <span className="anim-text block text-xs font-mono text-white/40 tracking-[0.3em] uppercase">
                Model No. {watch.id}
              </span>
              <h3 className="anim-text text-5xl md:text-7xl font-serif font-light">
                {watch.title}
              </h3>
              <p className="anim-text text-lg text-white/60 font-light max-w-md leading-relaxed">
                {watch.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}