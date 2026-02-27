'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Set initial state: Hidden and moved off-screen to prevent layout push
    gsap.set([cursorRef.current, ringRef.current], { 
      xPercent: -50, 
      yPercent: -50,
      opacity: 0 
    })

    // 2. Optimized setters (much faster than manual style strings)
    const xDot = gsap.quickSetter(cursorRef.current, "x", "px")
    const yDot = gsap.quickSetter(cursorRef.current, "y", "px")
    const xRing = gsap.quickSetter(ringRef.current, "x", "px")
    const yRing = gsap.quickSetter(ringRef.current, "y", "px")

    const handleMouseMove = (e: MouseEvent) => {
      // Show cursor on first movement
      gsap.to([cursorRef.current, ringRef.current], { opacity: 1, duration: 0.3 })

      // Move Dot instantly (or very fast)
      xDot(e.clientX)
      yDot(e.clientY)

      // Move Ring with a slight delay/smoothness using GSAP's internal lag smoothing
      gsap.to({}, {
        duration: 0.15,
        onUpdate: () => {
          xRing(e.clientX)
          yRing(e.clientY)
        }
      })
    }

    const handleHover = () => gsap.to(ringRef.current, { scale: 1.5, duration: 0.3 })
    const handleUnhover = () => gsap.to(ringRef.current, { scale: 1, duration: 0.3 })

    window.addEventListener('mousemove', handleMouseMove)

    const interactives = document.querySelectorAll('button, a, [role="button"]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', handleHover)
      el.addEventListener('mouseleave', handleUnhover)
    })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', handleHover)
        el.removeEventListener('mouseleave', handleUnhover)
      })
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 w-100vw z-9999 overflow-hidden">
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full mix-blend-difference"
      />
    </div>
  )
}
