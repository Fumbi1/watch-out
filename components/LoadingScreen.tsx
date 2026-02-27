'use client'

import { useEffect, useState } from 'react'

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [year, setYear] = useState<number | null>(null);

  // simulate a realistic non-linear loading progress
  useEffect(() => {
    setYear(new Date().getFullYear());
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        // Random increment to feel "organic" rather than robotic
        const increment = Math.random() * 15
        return Math.min(prev + increment, 100)
      })
    }, 150)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-white flex flex-col items-center justify-center overflow-hidden">

      {/* --- 1. Texture Overlay (Visual Continuity) --- */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
      />

      {/* --- 2. Central Counter (The Hero) --- */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-[12vw] md:text-[8vw] leading-none font-serif font-light tracking-tighter">
          {Math.floor(progress)}
          <span className="text-2xl md:text-4xl ml-2 font-mono text-white/40">%</span>
        </div>

        {/* Progress Bar Line */}
        <div className="w-64 h-px bg-white/10 mt-8 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* --- 3. Technical Metadata (Corners) --- */}

      {/* Top Left: Brand */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <h1 className="text-xl font-serif tracking-tight">LUXE.</h1>
      </div>

      {/* Top Right: Status */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 text-xs font-mono text-white/40 tracking-widest uppercase">
        System_Init
      </div>

      {/* Bottom Left: Coordinates/Tech junk */}
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 hidden md:block">
        <div className="flex flex-col gap-1 text-[10px] font-mono text-white/30 tracking-widest">
          <span>LAT: 48.8566° N</span>
          <span>LON: 2.3522° E</span>
          <span>EST: {year ?? "----"}</span> {/* Use a placeholder until mounted */}
        </div>
      </div>

      {/* Bottom Right: Dynamic Loading Text */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
        <div className="text-xs font-mono text-white/60 tracking-widest uppercase animate-pulse">
          {progress < 30 && "Loading Assets..."}
          {progress >= 30 && progress < 70 && "Calibrating Light..."}
          {progress >= 70 && progress < 100 && "Polishing Surfaces..."}
          {progress === 100 && "Ready."}
        </div>
      </div>

    </div>
  )
}