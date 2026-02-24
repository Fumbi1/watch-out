'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import CustomCursor from '../components/CustomCursor'
import Hero from '../components/Hero'
import Possibilities from '../components/Possibilities'
import Materials from '../components/Materials'

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Add these to prevent horizontal shifting
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    })

    // CRITICAL: Refresh ScrollTrigger when Lenis updates
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    // Remove overflow-x-hidden here; let Lenis/CSS handle the root
    <main className="relative w-full bg-black min-h-screen">
      <CustomCursor />
      <Hero />
      <Possibilities />
      <Materials />
    </main>
  )
}
