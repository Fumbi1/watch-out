'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Float, Environment } from '@react-three/drei'
import { useRouter } from 'next/navigation'

function MacroWatch() {
  const { scene } = useGLTF('/models/watch.glb')
  return (
    <Float 
      speed={1.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.2} 
      floatingRange={[-0.1, 0.1]}
    >
      {/* Tilted to show face and side profile in macro */}
      <primitive object={scene} scale={8} rotation={[0.4, -0.6, 0.2]} />
    </Float>
  )
}

export default function ConfiguratorCTA() {
  const router = useRouter()

  return (
    <section className="relative h-screen bg-black overflow-hidden flex items-center justify-center">
      
      {/* Background DOM Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[18vw] font-serif text-white/5 tracking-tighter whitespace-nowrap">
           MAKE IT YOURS
        </span>
      </div>

      {/* R3F Scene */}
      <div className="absolute inset-0 z-10 opacity-80">
        <Canvas camera={{ position: [0, 0, 15], fov: 30 }} dpr={[1, 1.5]}>
          <Environment preset="city" />
          <ambientLight intensity={0.2} />
          <Suspense fallback={null}>
            <MacroWatch />
          </Suspense>
        </Canvas>
      </div>

      {/* Foreground DOM Content */}
      <div className="relative z-20 text-center space-y-8">
        <h2 className="text-4xl md:text-6xl font-light text-white font-serif tracking-wide">
          Define Your Legacy.
        </h2>
        <button
          onClick={() => router.push('/editor')}
          className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-transparent border border-white/20 rounded-full transition-all duration-300 hover:bg-white hover:text-black hover:border-transparent"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
          <span className="relative text-sm tracking-[0.3em] uppercase">Launch Configurator</span>
        </button>
      </div>
    </section>
  )
}