'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MATERIALS = {
  cases: [
    {
      id: 'gold',
      name: '18K Champagne Gold',
      code: 'AU-750',
      description:
        'Forged from 75% pure gold, alloyed with copper and silver for durability. Each case is hand-polished to a mirror finish over 14 hours.',
      specs: ['18K (750 fineness)', 'Weight: 42g', 'Hypoallergenic'],
      color: '#FFD700',
      finish: 'High Polish',
    },
    {
      id: 'silver',
      name: 'Brushed Titanium',
      code: 'TI-6AL4V',
      description:
        'Grade 5 aerospace titanium, 40% lighter than steel yet twice as strong. Brushed satin finish resists fingerprints and scratches.',
      specs: ['Grade 5 Titanium', 'Weight: 24g', 'Anti-magnetic'],
      color: '#C0C0C0',
      finish: 'Brushed Satin',
    },
    {
      id: 'rose',
      name: 'Rose Gold Alloy',
      code: 'RG-585',
      description:
        'Proprietary blend of gold, copper, and palladium for that distinctive warm blush.',
      specs: ['14K Rose Gold', 'Weight: 38g', 'Tarnish-resistant'],
      color: '#B76E79',
      finish: 'Mirror Polish',
    },
    {
      id: 'carbon',
      name: 'Matte Carbon Fiber',
      code: 'CF-100',
      description:
        'Aerospace-grade carbon composite used in Formula 1 racing. 5× lighter than steel.',
      specs: ['Carbon Composite', 'Weight: 18g', 'Scratch-proof'],
      color: '#2C2C2C',
      finish: 'Matte Black',
    },
  ],
  straps: [
    {
      id: 'brown',
      name: 'Saddle Brown Leather',
      code: 'SB-VEG',
      description:
        'Italian vegetable-tanned calfskin from Tuscany that ages beautifully.',
      specs: ['Veg-tan Calfskin', 'Thickness: 3.5mm', 'Ages with wear'],
      color: '#8B4513',
      texture: 'Pebbled Grain',
    },
    {
      id: 'black',
      name: 'Obsidian Black Leather',
      code: 'OB-TOP',
      description:
        'Top-grain leather with smooth finish and water-resistant treatment.',
      specs: ['Top-grain Leather', 'Water-resistant', 'Timeless'],
      color: '#2C2416',
      texture: 'Smooth Finish',
    },
    {
      id: 'tan',
      name: 'Desert Tan Suede',
      code: 'DT-SUED',
      description:
        'Soft suede from premium split leather with nano stain protection.',
      specs: ['Split Leather', 'Suede finish', 'Stain-protected'],
      color: '#D2B48C',
      texture: 'Soft Suede',
    },
    {
      id: 'navy',
      name: 'Midnight Navy Canvas',
      code: 'MN-SAIL',
      description:
        'Marine-grade sailcloth canvas used for yacht sails.',
      specs: ['Sailcloth Canvas', 'Breathable', 'Marine-grade'],
      color: '#1E3A5F',
      texture: 'Woven Canvas',
    },
  ],
}

function MaterialCard({ material }: { material: any }) {
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
        y: 60,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl border border-white/5 bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm p-7 md:p-8 hover:border-white/15 transition-all duration-500 hover:-translate-y-1"
    >
      {/* Swatch */}
      <div className="flex justify-between items-start mb-6">
        <div
          className="w-20 h-20 rounded-xl border border-white/20 shadow-xl"
          style={{ background: material.color }}
        />

        <div className="text-right">
          <span className="block text-xs font-mono text-white/60">
            {material.code}
          </span>
          <span className="text-[10px] font-mono text-white/30 uppercase">
            {'finish' in material ? material.finish : material.texture}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-2xl md:text-3xl font-light mb-3"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {material.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/50 leading-relaxed mb-6">
        {material.description}
      </p>

      {/* Specs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {material.specs.map((spec: string, i: number) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full text-[11px] font-mono text-white/40 border border-white/10"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/editor"
        className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white transition"
      >
        Try in configurator →
      </Link>
    </div>
  )
}

export default function Materials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<'cases' | 'straps'>('cases')

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
        y: 80,
      })
    })

    return () => ctx.revert()
  }, [])

  const materials =
    activeTab === 'cases' ? MATERIALS.cases : MATERIALS.straps

  return (
    <section
      ref={sectionRef}
      className="relative bg-linear-to-b from-black via-zinc-900/20 to-black text-white py-28 md:py-36"
    >
      <div className="container-custom">

        {/* Header */}
        <div ref={headerRef} className="mb-24 max-w-4xl">
          <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase block mb-6">
            The Details
          </span>

          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Every choice
            <br />
            <span className="italic text-white/60">tells a story</span>
          </h2>

          <p className="text-lg text-white/40 mt-8">
            Materials sourced from the finest suppliers worldwide,
            selected for both beauty and longevity.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-16">
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-8 py-3 text-xs uppercase tracking-widest rounded-full transition ${
                activeTab === 'cases'
                  ? 'bg-white text-black'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Case Materials
            </button>

            <button
              onClick={() => setActiveTab('straps')}
              className={`px-8 py-3 text-xs uppercase tracking-widest rounded-full transition ${
                activeTab === 'straps'
                  ? 'bg-white text-black'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Strap Options
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {materials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>

        {/* Editor CTA */}
        <div className="mt-28 text-center">
          <p className="text-white/40 mb-8">
            Ready to build your own watch?
          </p>

          <Link
            href="/editor"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition"
          >
            Launch Configurator
          </Link>
        </div>
      </div>
    </section>
  )
}