import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const DesignThumbnail = ({ design, size = 200 }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !design) return;
    
    // Basic Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    
    // Set renderer size and pixel ratio
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Camera position
    camera.position.set(0, 0, 4);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 2);
    scene.add(directionalLight);
    
    // Create a simple t-shirt placeholder
    const geometry = new THREE.BoxGeometry(2, 2.2, 0.2);
    const material = new THREE.MeshStandardMaterial({
      color: design.design_data.color || '#EFBD48',
      roughness: 0.7,
      metalness: 0.1
    });
    
    const shirt = new THREE.Mesh(geometry, material);
    scene.add(shirt);
    
    // Add logo if present
    if (design.design_data.isLogoTexture) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(design.design_data.logoDecal, (texture) => {
        const logoGeometry = new THREE.PlaneGeometry(1, 1);
        const logoMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true
        });
        
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(0, 0, 0.11); // Slightly in front of shirt
        scene.add(logo);
      });
    }
    
    // Add full texture if present
    if (design.design_data.isFullTexture) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(design.design_data.fullDecal, (texture) => {
        material.map = texture;
        material.needsUpdate = true;
      });
    }
    
    // Add basic orbit controls for mouse interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material.map) object.material.map.dispose();
          object.material.dispose();
        }
      });
      
      renderer.dispose();
    };
  }, [design, size]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size}
      className="rounded-lg"
    />
  );
};

export default DesignThumbnail;
