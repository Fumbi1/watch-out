'use client'

import { useEffect, useState } from 'react'

export default function Loading() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }}
      />

      {/* Film grain */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative flex flex-col items-center gap-16 max-w-md px-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="w-16 h-px bg-white/10" />
            <span className="text-[10px] font-mono tracking-[0.4em] text-white/20 uppercase">
              Est. 2024
            </span>
            <div className="w-16 h-px bg-white/10" />
          </div>

          <h1 
            className="text-6xl md:text-7xl font-light tracking-tighter text-white"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            ATELIER
          </h1>

          <p className="text-xs font-mono tracking-[0.3em] text-white/30 uppercase">
            Horological Excellence
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-3">
          <div className="w-full h-px bg-white/5 overflow-hidden rounded-full">
            <div 
              className="h-full bg-linear-to-r from-white/40 via-white/80 to-white/40 transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 12px rgba(255,255,255,0.5)'
              }}
            />
          </div>

          {/* Percentage */}
          <div className="flex items-center justify-between text-xs font-mono text-white/20">
            <span className="tracking-wider">LOADING</span>
            <span className="tracking-wider">{progress}%</span>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-sm text-white/20 font-light animate-pulse">
            Preparing your experience
          </p>
        </div>
      </div>
    </div>
  )
}