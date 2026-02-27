'use client'

import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei'
import { useEffect, useState } from 'react'
import CameraController from '../components/CameraController'


const STRAP_OPTIONS = [
    { color: '#1E3A5F', name: 'Midnight Navy', code: 'MN-04' },
    { color: '#8B4513', name: 'Saddle Brown', code: 'SB-01' },
    { color: '#2C2416', name: 'Obsidian Black', code: 'OB-02' },
    { color: '#D2B48C', name: 'Desert Tan', code: 'DT-03' }
]

const CASE_OPTIONS = [
    { color: '#C0C0C0', name: 'Brushed Silver', material: 'Titanium', code: 'PT-950' },
    { color: '#FFD700', name: 'Champagne Gold', material: '18k Gold', code: 'AU-750' },
    { color: '#B76E79', name: 'Rose Gold', material: 'Rose Alloy', code: 'RG-585' },
    { color: '#2C2C2C', name: 'Matte Carbon', material: 'Carbon Fiber', code: 'CF-100' }
]

const CAMERA_PRESETS = [
    { label: '01', name: 'Front', pos: [0, 0, 15] as [number, number, number], key: 'front' },
    { label: '02', name: 'Side', pos: [17.5, 2, 7] as [number, number, number], key: 'side' },
    { label: '03', name: 'Angled', pos: [10, 7.5, 10] as [number, number, number], key: 'diagonal' },
    { label: '04', name: 'Detail', pos: [3, 3, 11] as [number, number, number], key: 'closeup' }
]


useGLTF.preload('/models/watch-compressed.glb', '/draco/'); // I am preloading the model for better performance

function Watch({ strapColor, caseFinish }: { strapColor: string; caseFinish: string }) {
    const { scene } = useGLTF('/models/watch-compressed.glb', '/draco/')

    useEffect(() => {
        scene.traverse((child: any) => {
            if (child.isMesh) {
                if (child.material.name === 'Green') {
                    child.material = child.material.clone()
                    child.material.color.set(caseFinish)
                    child.material.metalness = caseFinish !== '#2C2C2C' ? 1.0 : 0.6
                    child.material.roughness = caseFinish !== '#2C2C2C' ? 0.1 : 0.4
                    child.material.envMapIntensity = 1.8
                }

                if (child.material.name === 'MetalGrey') {
                    child.material = child.material.clone()
                    child.material.color.set('#C0C0C0')
                    child.material.metalness = 1.0
                    child.material.roughness = 0.05
                    child.material.envMapIntensity = 1.5
                }

                if (child.material.name === 'DarkPins.001') {
                    child.material = child.material.clone()
                    child.material.color.set(strapColor)
                    child.material.metalness = 0.1
                    child.material.roughness = 0.85
                }

                if (child.material.name === 'Black') {
                    child.material = child.material.clone()
                    child.material.color.set('#050505')
                    child.material.metalness = 0.9
                    child.material.roughness = 0.15
                }
            }
        })
    }, [scene, strapColor, caseFinish])

    return (
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3} floatingRange={[-0.05, 0.05]}>
            <primitive object={scene} scale={5} />
        </Float>
    )
}

// --- Main Component ---
export default function Configurator() {
    const [strapColor, setStrapColor] = useState(STRAP_OPTIONS[0].color)
    const [caseFinish, setCaseFinish] = useState(CASE_OPTIONS[0].color)
    const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null)
    const [activeView, setActiveView] = useState('front')
    const [activeTab, setActiveTab] = useState<'case' | 'strap'>('case')

    const currentCase = CASE_OPTIONS.find(c => c.color === caseFinish)
    const currentStrap = STRAP_OPTIONS.find(s => s.color === strapColor)

    const setView = (position: [number, number, number], viewName: string) => {
        setCameraTarget(position)
        setActiveView(viewName)
    }

    return (
        <div className="relative w-screen h-screen bg-linear-to-br from-[#0a0a0a] via-[#050505] to-[#000000] overflow-hidden text-white selection:bg-white/20">

            {/* Cinematic Background Layers */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Radial gradient focus */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

                {/* Film grain */}
                <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
                    }}
                />

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                        backgroundSize: '100px 100px'
                    }}
                />
            </div>

            {/* Large Typography Backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] leading-none font-serif opacity-[0.015] whitespace-nowrap pointer-events-none select-none tracking-tighter">
                ATELIER
            </div>

            {/* 3D Canvas */}
            <Canvas
                frameloop='demand'
                camera={{ position: [0, 0, 15], fov: 50 }}
                className="absolute inset-0 z-10"
                shadows="soft"
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance"
                }}
                dpr={[1, 2]}
            >
                <color attach="background" args={['#050505']} />

                {/* Professional Lighting Setup */}
                <ambientLight intensity={0.25} />
                <spotLight
                    position={[12, 12, 8]}
                    angle={0.2}
                    penumbra={1}
                    intensity={2}
                />
                <spotLight
                    position={[-10, -8, -10]}
                    angle={0.25}
                    penumbra={1}
                    intensity={0.8}
                    color="#4a90e2"
                />
                <directionalLight position={[0, 10, 0]} intensity={0.5} />

                <Environment preset="apartment" resolution={256} />

                <CameraController target={cameraTarget} />
                <Watch strapColor={strapColor} caseFinish={caseFinish} />

                <ContactShadows
                    position={[0, -5, 0]}
                    resolution={128}
                    frames={1}
                    scale={20}
                    opacity={0.35}
                />

                <OrbitControls
                    enablePan={false}
                    enableDamping
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                    minPolarAngle={Math.PI / 3.5}
                    maxPolarAngle={Math.PI / 1.6}
                    minDistance={5}
                    maxDistance={40}
                />
            </Canvas>

            {/* UI Layer */}
            <main className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-12">

                {/* Header */}
                <header className="flex justify-between items-start pointer-events-auto">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter" style={{ fontFamily: 'Playfair Display, serif' }}>
                            ATELIER
                        </h1>
                        <p className="text-[9px] text-white/30 font-mono mt-1.5 tracking-[0.3em] uppercase">
                            Horological Precision
                        </p>
                    </div>

                    {/* Product Info */}
                    <div className="hidden lg:flex flex-col items-end gap-3 text-xs font-mono">
                        <div className="flex gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-white/25 text-[9px] tracking-wider mb-1">CASE</span>
                                <span className="text-white/80">{currentCase?.material}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-white/25 text-[9px] tracking-wider mb-1">STRAP</span>
                                <span className="text-white/80">{currentStrap?.name.split(' ')[0]}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-white/25 text-[9px] tracking-wider">TOTAL</span>
                            <div className="text-xl font-bold text-white mt-0.5">$12,450</div>
                        </div>
                    </div>
                </header>

                {/* Vertical View Strip (Right Side) */}
                <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-auto">
                    {CAMERA_PRESETS.map((view) => (
                        <button
                            key={view.key}
                            onClick={() => setView(view.pos, view.key)}
                            className="group flex items-center gap-4 justify-end"
                        >
                            {/* Label - fades in on hover */}
                            <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-mono tracking-wider transition-all duration-300 ${activeView === view.key
                                    ? 'text-white/90 opacity-100'
                                    : 'text-white/20 opacity-0 group-hover:opacity-100 group-hover:text-white/50'
                                    }`}>
                                    {view.name}
                                </span>
                                <span className="text-[9px] font-mono text-white/15">{view.label}</span>
                            </div>

                            {/* Vertical bar indicator */}
                            <div className={`rounded-full transition-all duration-500 ${activeView === view.key
                                ? 'w-1 h-14 bg-white shadow-lg shadow-white/20'
                                : 'w-0.5 h-8 bg-white/15 group-hover:bg-white/40 group-hover:h-10'
                                }`} />
                        </button>
                    ))}
                </div>

                {/* Bottom Dock */}
                <div className="w-full flex justify-center pointer-events-auto">
                    <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/60 w-full max-w-3xl hover:border-white/15 transition-all duration-300"
                        style={{
                            boxShadow: '0 8px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03)'
                        }}>

                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-5">

                            {/* Tab Toggle */}
                            <div className="flex bg-white/5 rounded-full p-1.5 border border-white/5">
                                {(['case', 'strap'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${activeTab === tab
                                            ? 'bg-white text-black shadow-lg'
                                            : 'text-white/30 hover:text-white/60'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="hidden md:block w-px h-12 bg-linear-to-b from-transparent via-white/15 to-transparent" />

                            <div className="flex-1 flex items-center gap-5 overflow-x-auto custom-scrollbar pb-2 md:pb-0 px-2">

                                {activeTab === 'case' && CASE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.color}
                                        onClick={() => setCaseFinish(opt.color)}
                                        className="group relative flex flex-col items-center gap-2.5 min-w-17.5"
                                    >
                                        <div className={`relative w-12 h-12 rounded-full transition-all duration-500 ${caseFinish === opt.color
                                            ? 'scale-110 ring-2 ring-white/60 ring-offset-2 ring-offset-black/50'
                                            : 'scale-100 hover:scale-105 border border-white/10 group-hover:border-white/30'
                                            }`}
                                            style={{
                                                backgroundColor: opt.color,
                                                boxShadow: caseFinish === opt.color
                                                    ? `0 0 24px ${opt.color}50, inset 0 2px 0 rgba(255,255,255,0.3)`
                                                    : 'inset 0 1px 0 rgba(255,255,255,0.15)'
                                            }}>
                                            <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                                        </div>

                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className={`text-[9px] uppercase font-mono tracking-wider whitespace-nowrap transition-colors ${caseFinish === opt.color ? 'text-white font-semibold' : 'text-white/25 group-hover:text-white/50'
                                                }`}>
                                                {opt.name.split(' ')[0]}
                                            </span>
                                            <span className={`text-[8px] font-mono transition-colors ${caseFinish === opt.color ? 'text-white/40' : 'text-white/15'
                                                }`}>
                                                {opt.code}
                                            </span>
                                        </div>
                                    </button>
                                ))}

                                {activeTab === 'strap' && STRAP_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.color}
                                        onClick={() => setStrapColor(opt.color)}
                                        className="group relative flex flex-col items-center gap-2.5 min-w-17.5"
                                    >
                                        <div className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-500 ${strapColor === opt.color
                                            ? 'scale-110 ring-2 ring-white/60 ring-offset-2 ring-offset-black/50'
                                            : 'scale-100 hover:scale-105 border border-white/10 group-hover:border-white/30'
                                            }`}
                                            style={{
                                                backgroundColor: opt.color,
                                                boxShadow: strapColor === opt.color
                                                    ? `0 0 24px ${opt.color}50`
                                                    : 'none'
                                            }}>
                                            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+CjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzAwMCIvPgo8Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iMiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xIi8+CjxjaXJjbGUgY3g9IjE1IiBjeT0iMTUiIHI9IjIiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjEiLz4KPGNpcmNsZSBjeD0iMzUiIGN5PSIzNSIgcj0iMiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xIi8+CjxjaXJjbGUgY3g9IjQ1IiBjeT0iNDUiIHI9IjIiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]" />
                                            <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent" />
                                        </div>

                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className={`text-[9px] uppercase font-mono tracking-wider whitespace-nowrap transition-colors ${strapColor === opt.color ? 'text-white font-semibold' : 'text-white/25 group-hover:text-white/50'
                                                }`}>
                                                {opt.name.split(' ')[0]}
                                            </span>
                                            <span className={`text-[8px] font-mono transition-colors ${strapColor === opt.color ? 'text-white/40' : 'text-white/15'
                                                }`}>
                                                {opt.code}
                                            </span>
                                        </div>
                                    </button>
                                ))}

                            </div>

                            <button className="bg-white text-black h-11 px-7 rounded-full font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20">
                                Configure
                            </button>
                        </div>
                    </div>
                </div>

            </main>

            {/* Custom Scrollbar */}
            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    )
}