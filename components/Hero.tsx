'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, PresentationControls, ContactShadows, Float } from '@react-three/drei'
import { Group } from 'three' // Only importing the Type, not the library logic

gsap.registerPlugin(ScrollTrigger)

// --- 3D Component ---
function HeroWatch({ isMobile }: { isMobile: boolean }) {
  const { scene } = useGLTF('/models/golden_watch.glb')
  
  return (
    <Float 
      speed={2.5} // Animation speed
      rotationIntensity={1} // XYZ rotation intensity
      floatIntensity={1}    // Up/down float intensity
      floatingRange={[-0.1, 0.1]} // Range of y-axis values
    >
      <primitive 
        object={scene} 
        scale={isMobile ? 0.5 : 1.5} 
        position={[0, 0, 0]} 
        rotation={[0, -0.5, 0]} // Initial slight angle
      />
    </Float>
  )
}

function HeroScene() {
  const [isMobile, setIsMobile] = useState(false)

  // Simple responsive check
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <>
      <Environment preset="city" resolution={512} />
      
      <PresentationControls
        global={false}
        cursor={true}
        snap={true} 
        speed={1.5}
        zoom={1}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 6, Math.PI / 6]} // Vertical limits
        azimuth={[-Math.PI / 4, Math.PI / 4]} // Horizontal limits
      >
        <HeroWatch isMobile={isMobile} />
      </PresentationControls>

      <ContactShadows 
        position={[0, -2.5, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />
    </>
  )
}

// --- Main Page Component ---
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // DOM Animation: Reveal Text
      gsap.fromTo(textRef.current, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out', delay: 0.2 }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center">
      
      {/* HTML Layer (Background) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none">
        <h1 
          ref={textRef}
          className="text-[18vw] md:text-[22vw] leading-none font-serif text-white/5 tracking-tighter blur-[1px]"
        >
          ATELIER
        </h1>
      </div>

      {/* R3F Layer (Interactive) */}
      <div className="absolute inset-0 z-10 w-full h-full">
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 50 }} 
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML Layer (Foreground UI) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-8 md:p-12">
        <div className="flex justify-between items-start opacity-60">
          <span className="text-sm font-mono tracking-widest uppercase text-white">Luxe Configurator</span>
        </div>
      </div>
    </section>
  )
}