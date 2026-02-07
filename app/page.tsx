'use client'

import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { useEffect, useState } from 'react'

function Watch({ strapColor, caseFinish }: { strapColor: string; caseFinish: string }) {
  const { scene } = useGLTF('/models/watch.glb')

  // This logs ALL the parts and materials
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {

        // WATCH FACE & DETAILS → White/Silver (elegant)
        if (child.material.name === 'Green') {
          child.material = child.material.clone()
          child.material.color.set(caseFinish) // Light silver/white
          child.material.metalness = caseFinish !== '#2C2C2C' ? 0.95 : 0.8
          child.material.roughness = caseFinish !== '#2C2C2C' ? 0.1 : 0.3
        }

        // HOUR MARKERS & HANDS → Polished Silver
        if (child.material.name === 'MetalGrey') {
          child.material = child.material.clone()
          child.material.color.set('#C0C0C0') // Silver
          child.material.metalness = 0.9
          child.material.roughness = 0.1 // Shiny!
        }

        // WATCH STRAP → Brown Leather
        if (child.material.name === 'DarkPins.001') {
          child.material = child.material.clone()
          child.material.color.set(strapColor) // Brown leather
          child.material.metalness = 0.0 // Not metal
          child.material.roughness = 0.8 // Matte leather texture
        }

        // BUTTONS → Dark accents
        if (child.material.name === 'Black') {
          child.material = child.material.clone()
          child.material.color.set('#1a1a1a') // Dark grey (not pure black)
          child.material.metalness = 0.7
          child.material.roughness = 0.3
        }
      }
    })
  }, [scene, strapColor, caseFinish])
  return <primitive object={scene} scale={5} />
}

export default function Home() {
  const [strapColor, setStrapColor] = useState('#1E3A5F')
  const [caseFinish, setCaseFinish] = useState('#C0C0C0')

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [3, 2, 6], fov: 50 }}>
        {/* Soft ambient base */}
        <ambientLight intensity={0.3} />

        {/* Main key light - top right */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
        />

        {/* Fill light - soften shadows */}
        <directionalLight
          position={[-5, 2, -5]}
          intensity={0.5}
        />

        {/* Clean studio environment */}
        <Environment preset="studio" />

        <Watch strapColor={strapColor} caseFinish={caseFinish} />
        <OrbitControls enablePan={false} />
      </Canvas>

      <div className=" flex w-4/5 justify-between mx-auto absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">
            Strap Color
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setStrapColor('#8B4513')}
              className="w-12 h-12 rounded-full border-2 border-gray-300 hover:scale-110 transition"
              style={{ backgroundColor: '#8B4513' }}
            />
            <button
              onClick={() => setStrapColor('#2C2416')}
              className="w-12 h-12 rounded-full border-2 border-gray-300 hover:scale-110 transition"
              style={{ backgroundColor: '#2C2416' }}
            />
            <button
              onClick={() => setStrapColor('#D2B48C')}
              className="w-12 h-12 rounded-full border-2 border-gray-300 hover:scale-110 transition"
              style={{ backgroundColor: '#D2B48C' }}
            />
            <button
              onClick={() => setStrapColor('#1E3A5F')}
              className="w-12 h-12 rounded-full border-2 border-gray-300 hover:scale-110 transition"
              style={{ backgroundColor: '#1E3A5F' }}
            />
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">
            Case Finish
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setCaseFinish('#FFD700')}
              className="w-fit px-1 h-12 rounded-sm border-2 border-gray-300 hover:scale-110 transition"
              style={{ backgroundColor: '#FFD700' }}>
              Gold
            </button>
            <button
              onClick={() => setCaseFinish('#C0C0C0')}
              className="w-12 h-12 rounded-full border-2 border-gray-300 hover:scale-110 transition"
              style={{ backgroundColor: '#C0C0C0' }}>
              Silver
            </button>
            <button
              onClick={() => setCaseFinish('#B76E79')}
              className="w-12 h-12 rounded-full border-2 border-gray-300 hover:scale-110 transition"
              style={{ backgroundColor: '#B76E79' }}>
              Rose Gold
            </button>

            <button
              onClick={() => {
                setCaseFinish('#2C2C2C')
              }}
              className="w-12 h-12 rounded-full border-2 border-gray-300 hover:scale-110 transition"
              style={{ backgroundColor: '#2C2C2C' }}>
              Black
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}