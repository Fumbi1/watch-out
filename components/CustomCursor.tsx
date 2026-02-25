'use client'

import { useEffect, useRef, useCallback } from 'react'

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const isHoveringRef = useRef(false)

  const animate = useCallback(() => {
    if (!cursorDotRef.current || !cursorRingRef.current) return

    // Smooth lerp animation
    positionRef.current.x += (targetRef.current.x - positionRef.current.x) * 0.15
    positionRef.current.y += (targetRef.current.y - positionRef.current.y) * 0.15

    const { x, y } = positionRef.current

    // Use transform3d for GPU acceleration
    cursorDotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    cursorRingRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${isHoveringRef.current ? 1.5 : 1})`

    requestRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseEnter = () => {
      isHoveringRef.current = true
    }

    const handleMouseLeave = () => {
      isHoveringRef.current = false
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate])

  return (
    <>
      {/* Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      {/* Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-200"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}