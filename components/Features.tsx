'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const FEATURES = [
  {
    number: '01',
    title: 'Precision Engineering',
    description: 'Swiss-made movements with tolerance measured in microns. Every component crafted to perfection.',
    stat: '±2 sec/day',
  },
  {
    number: '02',
    title: 'Luxury Materials',
    description: 'Premium 18k gold, platinum, and aerospace-grade titanium. Materials chosen for lifetime endurance.',
    stat: '316L Steel',
  },
  {
    number: '03',
    title: 'Timeless Design',
    description: 'Minimalist aesthetics that transcend trends. A watch that becomes more beautiful with age.',
    stat: '10 ATM',
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      featuresRef.current.forEach((feature, index) => {
        gsap.from(feature, {
          scrollTrigger: {
            trigger: feature,
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
          },
          opacity: 0,
          y: 100,
          duration: 1,
        })
      })

      // Background color transition
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        backgroundColor: '#0a0a0a',
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-black text-white py-32 px-8 md:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl md:text-8xl font-serif mb-24 tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
          Crafted for<br />Eternity
        </h2>

        <div className="space-y-32">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.number}
              ref={(el) => { if (el) featuresRef.current[index] = el }}
              className="grid md:grid-cols-2 gap-12 items-start"
            >
              {/* Left - Number & Stat */}
              <div className="space-y-4">
                <div className="text-[10vw] md:text-[8vw] font-serif leading-none text-white/5">
                  {feature.number}
                </div>
                <div className="text-4xl md:text-6xl font-mono text-white/20">
                  {feature.stat}
                </div>
              </div>

              {/* Right - Content */}
              <div className="space-y-6">
                <h3 className="text-3xl md:text-5xl font-serif tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-lg md:text-xl text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}