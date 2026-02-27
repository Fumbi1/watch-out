'use client'

import { useEffect, useRef, Suspense, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, Environment, ContactShadows } from '@react-three/drei'

gsap.registerPlugin(ScrollTrigger)

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
    description: 'Less is infinite. Brushed silver titanium with midnight navy — for those who speak softly.',
    case: '#C0C0C0',
    strap: '#1E3A5F',
    mood: 'Refined',
    occasion: 'Daily · Versatile',
  },
  {
    id: 'heritage',
    name: 'The Heritage',
    tagline: 'Timeless Elegance',
    description: 'Old soul, modern heart. Rose gold warmth meets obsidian black — heirloom in the making.',
    case: '#B76E79',
    strap: '#2C2416',
    mood: 'Classic',
    occasion: 'Evening · Special',
  },
  {
    id: 'adventurer',
    name: 'The Adventurer',
    tagline: 'Unstoppable Spirit',
    description: 'Built for the journey. Matte carbon fiber with desert tan — wherever life takes you.',
    case: '#2C2C2C',
    strap: '#D2B48C',
    mood: 'Resilient',
    occasion: 'Sport · Outdoor',
  },
  {
    id: 'architect',
    name: 'The Architect',
    tagline: 'Precision Thinking',
    description: 'Form follows function. Silver case, black leather — for minds that build the future.',
    case: '#C0C0C0',
    strap: '#2C2416',
    mood: 'Analytical',
    occasion: 'Creative · Studio',
  },
  {
    id: 'maverick',
    name: 'The Maverick',
    tagline: 'Break Convention',
    description: 'Rules are guidelines. Rose gold rebellion with navy depth — for the contrarian.',
    case: '#B76E79',
    strap: '#1E3A5F',
    mood: 'Bold',
    occasion: 'Unconventional',
  },
]

function ConfigWatch({ caseColor, strapColor }: { caseColor: string; strapColor: string }) {
  const { scene } = useGLTF('/models/watch.glb', '/draco/')
  const clonedScene = scene.clone()

  useEffect(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone()

        if (child.material.name === 'Green') {
          child.material.color.set(caseColor)
          child.material.metalness = caseColor !== '#2C2C2C' ? 1.0 : 0.6
          child.material.roughness = caseColor !== '#2C2C2C' ? 0.1 : 0.4
          child.material.envMapIntensity = 1.8
        }

        if (child.material.name === 'DarkPins.001') {
          child.material.color.set(strapColor)
          child.material.metalness = 0.1
          child.material.roughness = 0.85
        }

        if (child.material.name === 'MetalGrey') {
          child.material.metalness = 1.0
          child.material.roughness = 0.05
        }

        if (child.material.name === 'Black') {
          child.material.color.set('#050505')
          child.material.metalness = 0.9
          child.material.roughness = 0.15
        }
      }
    })
  }, [caseColor, strapColor, clonedScene])

  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.15}>
      <primitive object={clonedScene} scale={4.5} rotation={[0, Math.PI / 4, 0]} />
    </Float>
  )
}

function ConfigCard({ config, index }: { config: typeof CONFIGURATIONS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation on scroll
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: true,
        },
        opacity: 0,
        y: 100,
        scale: 0.9,
      })
    }, cardRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={cardRef}
      className="group relative bg-linear-to-b from-white/3 to-white/1 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Watch */}
      <div 
        ref={canvasRef}
        className="relative h-80 md:h-96 bg-linear-to-b from-black/50 to-black/80"
      >
        <Canvas
          dpr={[1, 2]}
          frameloop="demand"
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['transparent']} />
          <ambientLight intensity={0.3} />
          <spotLight position={[10, 10, 10]} intensity={1.5} />
          <Environment preset="studio" resolution={128} />
          <Suspense fallback={null}>
            <ConfigWatch caseColor={config.case} strapColor={config.strap} />
          </Suspense>
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.25} 
            scale={12}
            blur={2}
            frames={1}
            resolution={64}
          />
        </Canvas>

        {/* Hover overlay */}
        <div 
          className={`absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative p-8 space-y-4">
        {/* Number */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex gap-3">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white/20"
              style={{ backgroundColor: config.case }}
            />
            <div 
              className="w-8 h-8 rounded-full border-2 border-white/20"
              style={{ backgroundColor: config.strap }}
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 
            className="text-3xl md:text-4xl font-light tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {config.name}
          </h3>
          <p className="text-sm text-white/40 mt-1 font-medium">
            {config.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base text-white/50 leading-relaxed font-light">
          {config.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="space-y-1">
            <span className="block text-[10px] font-mono text-white/25 uppercase tracking-wider">
              Mood
            </span>
            <span className="block text-xs text-white/60 font-medium">
              {config.mood}
            </span>
          </div>
          <div className="space-y-1 text-right">
            <span className="block text-[10px] font-mono text-white/25 uppercase tracking-wider">
              Best For
            </span>
            <span className="block text-xs text-white/60 font-medium">
              {config.occasion}
            </span>
          </div>
        </div>

        {/* Hover CTA */}
        <div 
          className={`pt-4 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <button className="text-xs font-mono text-white/40 hover:text-white transition-colors uppercase tracking-widest border-b border-white/20 hover:border-white/60 pb-1">
            Configure This Style →
          </button>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div 
        className={`absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
      />
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
          scrub: true,
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
      className="relative min-h-screen bg-black text-white py-24 md:py-32"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-gray-900/20 to-black pointer-events-none" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-20 md:mb-32">
          <div className="flex items-end justify-between border-b border-white/5 pb-12">
            <div className="max-w-2xl">
              <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase block mb-6">
                Six Expressions
              </span>
              <h2 
                className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Not a collection.<br />
                <span className="italic text-white/60">A canvas.</span>
              </h2>
            </div>
            <div className="hidden lg:block text-right max-w-xs">
              <p className="text-sm text-white/40 font-light leading-relaxed">
                The same exceptional timepiece. Six distinct personalities. 
                Which speaks to you?
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {CONFIGURATIONS.map((config, index) => (
            <ConfigCard key={config.id} config={config} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 md:mt-32 text-center">
          <p className="text-sm md:text-base text-white/40 font-light mb-8">
            Or create something entirely yours
          </p>
          <Link href="/editor" className="group relative bg-white text-black px-10 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-all duration-300 shadow-2xl shadow-white/10">
            <span className="relative z-10">Open Configurator</span>
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  )
}