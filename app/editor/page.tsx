'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Loading from '@/components/LoadingScreen'

const Scene = dynamic(() => import('@/components/Configurator'), { 
  ssr: false,
  loading: () => <Loading />
})

export default function Configurator() {
  return (
    <div className="relative w-screen h-screen">
      <Suspense fallback={<Loading />}>
        <Scene />
      </Suspense>
      {/* UI controls */}
    </div>
  )
}