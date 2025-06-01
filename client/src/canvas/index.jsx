import { Canvas } from '@react-three/fiber'
import { Environment, Center } from '@react-three/drei';
import { Suspense } from 'react';

import Shirt from './Shirt';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

function ErrorFallback({ error }) {
  console.error(error);
  return null; // Return null to hide the error in the 3D scene
}

const CanvasModel = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.3}
          castShadow
        />
        <Environment 
          preset="city" // Use a preset instead of loading external HDR
          background={false} // Don't show environment as background
          intensity={0.4} // Slightly reduce environment intensity for better fabric visibility
        /><CameraRig>
          <Backdrop />
          <Center>
            <Shirt />
          </Center>
        </CameraRig>
      </Suspense>
    </Canvas>
  )
}

export default CanvasModel

