'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MATERIALS = {
  cases: [
    {
      id: 'gold',
      name: '18K Champagne Gold',
      code: 'AU-750',
      description: 'Forged from 75% pure gold, alloyed with copper and silver for durability. Each case is hand-polished to a mirror finish over 14 hours.',
      specs: ['18K (750 fineness)', 'Weight: 42g', 'Hypoallergenic'],
      color: '#FFD700',
      finish: 'High Polish',
    },
    {
      id: 'silver',
      name: 'Brushed Titanium',
      code: 'TI-6AL4V',
      description: 'Grade 5 aerospace titanium, 40% lighter than steel yet twice as strong. Brushed satin finish resists fingerprints and scratches.',
      specs: ['Grade 5 Titanium', 'Weight: 24g', 'Anti-magnetic'],
      color: '#C0C0C0',
      finish: 'Brushed Satin',
    },
    {
      id: 'rose',
      name: 'Rose Gold Alloy',
      code: 'RG-585',
      description: 'Proprietary blend of gold, copper, and palladium for that distinctive warm blush. Resistant to tarnishing, maintains color for generations.',
      specs: ['14K Rose Gold', 'Weight: 38g', 'Tarnish-resistant'],
      color: '#B76E79',
      finish: 'Mirror Polish',
    },
    {
      id: 'carbon',
      name: 'Matte Carbon Fiber',
      code: 'CF-100',
      description: 'Aerospace-grade carbon composite, used in F1 racing. 5x lighter than steel, virtually indestructible. Matte black finish absorbs light.',
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
      description: 'Italian vegetable-tanned calfskin from Tuscany. Ages beautifully, developing unique patina over time. Hand-stitched with contrast thread.',
      specs: ['Veg-tan Calfskin', 'Thickness: 3.5mm', 'Ages with wear'],
      color: '#8B4513',
      texture: 'Pebbled Grain',
    },
    {
      id: 'black',
      name: 'Obsidian Black Leather',
      code: 'OB-TOP',
      description: 'Top-grain leather with smooth finish. Water-resistant treatment ensures longevity. Classic black that pairs with everything.',
      specs: ['Top-grain Leather', 'Water-resistant', 'Timeless'],
      color: '#2C2416',
      texture: 'Smooth Finish',
    },
    {
      id: 'tan',
      name: 'Desert Tan Suede',
      code: 'DT-SUED',
      description: 'Soft suede from premium split leather. Casual elegance with tactile richness. Protected with nano-coating against stains.',
      specs: ['Split Leather', 'Suede finish', 'Stain-protected'],
      color: '#D2B48C',
      texture: 'Soft Suede',
    },
    {
      id: 'navy',
      name: 'Midnight Navy Canvas',
      code: 'MN-SAIL',
      description: 'Marine-grade sailcloth canvas, developed for yacht sails. Breathable, durable, and perfectly casual. Reinforced with leather backing.',
      specs: ['Sailcloth Canvas', 'Breathable', 'Marine-grade'],
      color: '#1E3A5F',
      texture: 'Woven Canvas',
    },
  ],
}

function MaterialCard({ 
  material, 
  type 
}: { 
  material: typeof MATERIALS.cases[0] | typeof MATERIALS.straps[0]
  type: 'case' | 'strap'
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    gsap.from(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 85%',
        end: 'top 50%',
        scrub: 1,
      },
      opacity: 0,
      x: type === 'case' ? -60 : 60,
    })
  }, [type])

  return (
    <div
      ref={cardRef}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-linear-to-br from-white/4 to-white/1 backdrop-blur-sm border border-white/5 rounded-2xl p-8 md:p-10 hover:border-white/10 transition-all duration-500">
        
        {/* Material swatch */}
        <div className="flex items-start justify-between mb-8">
          <div 
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-white/20 shadow-2xl relative overflow-hidden"
            style={{ backgroundColor: material.color }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")` }}
            />
          </div>
          <div className="text-right">
            <span className="block text-xs font-mono text-white/60 mb-1">
              {material.code}
            </span>
            <span className="block text-[10px] font-mono text-white/30 uppercase tracking-wider">
              {'finish' in material ? material.finish : material.texture}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h3 
              className="text-2xl md:text-3xl font-light tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {material.name}
            </h3>
          </div>

          <p className="text-sm md:text-base text-white/50 leading-relaxed font-light">
            {material.description}
          </p>

          {/* Specs */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
            {material.specs.map((spec, i) => (
              <span 
                key={i}
                className="px-3 py-1.5 bg-white/5 rounded-full text-[11px] font-mono text-white/40 border border-white/5"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Hover indicator */}
        <div 
          className={`absolute bottom-8 right-8 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="text-white/20"
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function Materials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'cases' | 'straps'>('cases')

  useEffect(() => {
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
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-black via-gray-900/10 to-black text-white py-24 md:py-32"
    >
      <div className="container-custom relative z-10">
        
        {/* Header */}
        <div ref={headerRef} className="mb-20 md:mb-28">
          <span className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase block mb-6">
            The Details
          </span>
          <h2 
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-none max-w-4xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Every choice<br />
            <span className="italic text-white/60">tells a story</span>
          </h2>
          <p className="text-lg md:text-xl text-white/40 font-light mt-8 max-w-2xl leading-relaxed">
            We source materials from the world's finest suppliers. 
            Each component chosen not just for beauty, but for a lifetime of wear.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-full p-2 border border-white/10">
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-8 md:px-12 py-4 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                activeTab === 'cases'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Case Materials
            </button>
            <button
              onClick={() => setActiveTab('straps')}
              className={`px-8 md:px-12 py-4 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                activeTab === 'straps'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Strap Options
            </button>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {(activeTab === 'cases' ? MATERIALS.cases : MATERIALS.straps).map((material) => (
            <MaterialCard 
              key={material.id} 
              material={material} 
              type={activeTab === 'cases' ? 'case' : 'strap'}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 border-t border-white/5">
          {[
            { label: 'Material Options', value: '8' },
            { label: 'Configurations', value: '16' },
            { label: 'Craft Hours', value: '92' },
            { label: 'Warranty Years', value: '10' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div 
                className="text-5xl md:text-6xl font-light text-white/90 mb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-mono text-white/30 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Ambient light */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />
    </section>
  )
}