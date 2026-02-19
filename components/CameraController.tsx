import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect } from 'react'


export default function CameraController({ target }: { target: [number, number, number] | null }) {
  const { camera, controls } = useThree()
  
  useEffect(() => {
    if (target) {
      // Animate camera when target changes
      gsap.to(camera.position, {
        x: target[0],
        y: target[1],
        z: target[2],
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          // Update OrbitControls target during animation
          if (controls) {
            controls.update()
          }
        }
      })
    }
  }, [target, camera, controls])
  
  return null
}