import React, { useMemo } from 'react'
import { useSnapshot } from 'valtio';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import state from '../store';

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  // Create a fabric-like normal map for more realistic material
  const fabricNormalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create a subtle fabric weave pattern
    const imageData = ctx.createImageData(512, 512);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % 512;
      const y = Math.floor((i / 4) / 512);
      
      // Create a subtle weave pattern
      const waveX = Math.sin(x * 0.1) * 10;
      const waveY = Math.sin(y * 0.1) * 10;
      const noise = Math.random() * 30;
      
      const intensity = 128 + waveX + waveY + noise;
      
      data[i] = intensity;     // R
      data[i + 1] = intensity; // G  
      data[i + 2] = 255;       // B (normal map blue channel)
      data[i + 3] = 255;       // A
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4); // Repeat for fabric detail
    return texture;
  }, []);

  const stateString = JSON.stringify(snap);

  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male?.geometry}
        dispose={null}
      >        {/* Enhanced fabric-like material for realistic T-shirt appearance */}
        <meshStandardMaterial 
          color={snap.color}
          roughness={0.75}
          metalness={0.0}
          normalMap={fabricNormalMap}
          normalScale={[0.4, 0.4]}
          envMapIntensity={0.2}
          // Fabric-like properties
          transparent={false}
          opacity={1.0}
          side={THREE.DoubleSide}
          // Add subtle subsurface scattering effect
          transmission={0.0}
          thickness={0.1}
        />
        
        {snap.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {snap.isLogoTexture && (
          <Decal 
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  )
}

export default Shirt