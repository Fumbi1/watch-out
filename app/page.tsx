'use client'

import { useEffect, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import dynamic from 'next/dynamic'

// Lazy load components for better performance
const Hero = dynamic(() => import('../components/Hero'), {
  loading: () => <div className="h-screen bg-black" />
})
const Possibilities = dynamic(() => import('../components/Possibilities'), {
  loading: () => <div className="min-h-screen bg-black" />
})
const Materials = dynamic(() => import('../components/Materials'), {
  loading: () => <div className="min-h-screen bg-black" />
})
const ComparisonSlider = dynamic(() => import('@/components/ComparisonSlider'), {
  loading: () => <div className="min-h-screen bg-black" />
})
const ConfiguratorCTA = dynamic(() => import('@/components/ConfiguratorCTA'), {
  loading: () => <div className="min-h-screen bg-black" />
})

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      syncTouch: false,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <main className="relative w-full bg-black min-h-screen overflow-x-hidden">
      <Suspense fallback={<div className="h-screen bg-black" />}>
        <Hero />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Possibilities />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Materials />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <ComparisonSlider />
      </Suspense>
      
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <ConfiguratorCTA />
      </Suspense>
    </main>
  )
}