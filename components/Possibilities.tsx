'use client'

import { useEffect, useRef, Suspense, useMemo } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)
useGLTF.preload('/models/watch-compressed.glb', '/draco/')

const CONFIGURATIONS = [
  {
    id: 'executive',
    name: 'The Executive',
    tagline: 'Boardroom Power',
    description: 'Command respect. 18K gold case with deep brown leather — the choice of leaders.',
    case: '#FFD700',
    strap: '#8B4513',
    mood: 'Authoritative',
    occasion: 'Business · Formal',
  },
  {
    id: 'minimalist',
    name: 'The Minimalist',
    tagline: 'Pure Clarity',
    description: 'Less is infinite. Brushed silver titanium with midnight navy, for those who speak softly.',
    case: '#C0C0C0',
    strap: '#1E3A5F',
    mood: 'Refined',
    occasion: 'Daily · Versatile',
  },
  {
    id: 'heritage',
    name: 'The Heritage',
    tagline: 'Timeless Elegance',
    description: 'Old soul, modern heart. Rose gold warmth meets obsidian black, heirloom in the making.',
    case: '#B76E79',
    strap: '#2C2416',
    mood: 'Classic',
    occasion: 'Evening · Special',
  },
  {
    id: 'adventurer',
    name: 'The Adventurer',
    tagline: 'Unstoppable Spirit',
    description: 'Built for the journey. Matte carbon fiber with desert tan, wherever life takes you.',
    case: '#2C2C2C',
    strap: '#D2B48C',
    mood: 'Resilient',
    occasion: 'Sport · Outdoor',
  },
  {
    id: 'architect',
    name: 'The Architect',
    tagline: 'Precision Thinking',
    description: 'Form follows function. Silver case, black leather, for minds that build the future.',
    case: '#C0C0C0',
    strap: '#2C2416',
    mood: 'Analytical',
    occasion: 'Creative · Studio',
  },
  {
    id: 'maverick',
    name: 'The Maverick',
    tagline: 'Break Convention',
    description: 'Rules are guidelines. Rose gold rebellion with navy depth, for the contrarian.',
    case: '#B76E79',
    strap: '#1E3A5F',
    mood: 'Bold',
    occasion: 'Unconventional',
  },
]

function ConfigWatch({ caseColor, strapColor }: { caseColor: string; strapColor: string }) {
  const { scene } = useGLTF('/models/watch-compressed.glb', '/draco/')

  const cloned = useMemo(() => {
    const clone = scene.clone()

    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone()

        if (child.material.name === 'Green') {
          child.material.color.set(caseColor)
          child.material.metalness = 1
          child.material.roughness = 0.15
          child.material.envMapIntensity = 2
        }

        if (child.material.name === 'DarkPins.001') {
          child.material.color.set(strapColor)
          child.material.roughness = 0.8
        }
      }
    })

    return clone
  }, [scene, caseColor, strapColor])

  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.15}>
      <primitive object={cloned} scale={3.6} rotation={[0, Math.PI / 4, 0]} />
    </Float>
  )
}

function ConfigCard({ config, index }: { config: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1,
        },
        opacity: 0,
        y: 80,
        scale: 0.94,
      })
    }, cardRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl border border-white/5 bg-linear-to-b from-white/4 to-white/1 backdrop-blur-sm overflow-hidden hover:border-white/15 transition-all duration-500"
    >
      {/* Watch */}
      <div className="relative h-80 md:h-96 bg-linear-to-b from-zinc-900 to-black">
        <Canvas
          dpr={[1, 1.3]}
          camera={{ position: [0, 0, 9], fov: 45 }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.8} />

          <directionalLight position={[5, 6, 5]} intensity={1.6} />

          <directionalLight position={[-5, 3, -4]} intensity={0.6} />

          <Environment preset="studio" resolution={64} />

          <Suspense fallback={null}>
            <ConfigWatch caseColor={config.case} strapColor={config.strap} />
          </Suspense>

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.3}
            scale={10}
            blur={2}
            resolution={64}
          />
        </Canvas>

        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full border border-white/20" style={{ background: config.case }} />
            <div className="w-6 h-6 rounded-full border border-white/20" style={{ background: config.strap }} />
          </div>
        </div>

        {/* Title */}
        <div>
          <h3
            className="text-3xl font-light tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {config.name}
          </h3>

          <p className="text-sm text-white/40 mt-1">{config.tagline}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed">
          {config.description}
        </p>

        {/* Meta */}
        <div className="flex justify-between pt-6 border-t border-white/5 text-xs">
          <div>
            <span className="block text-white/30 uppercase tracking-wider text-[10px] font-mono">
              Mood
            </span>
            <span className="text-white/60">{config.mood}</span>
          </div>

          <div className="text-right">
            <span className="block text-white/30 uppercase tracking-wider text-[10px] font-mono">
              Best For
            </span>
            <span className="text-white/60">{config.occasion}</span>
          </div>
        </div>

        {/* CTA */}
        <button className="pt-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors">
          Configure Style →
        </button>
      </div>

      <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  )
}

export default function Possibilities() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1,
        },
        opacity: 0,
        y: 60,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white py-28 md:py-36"
    >
      <div className="container-custom relative z-10">

        {/* Header */}
        <div ref={headerRef} className="mb-24">
          <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase block mb-6">
            Six Expressions
          </span>

          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Not a collection.
            <br />
            <span className="italic text-white/60">A canvas.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONFIGURATIONS.map((config, i) => (
            <ConfigCard key={config.id} config={config} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-32 text-center">
          <p className="text-white/40 mb-8">
            Or create something entirely yours
          </p>

          <Link
            href="/editor"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition"
          >
            Open Configurator
          </Link>
        </div>
      </div>
    </section>
  )
}