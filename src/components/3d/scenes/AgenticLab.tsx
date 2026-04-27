'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import CubeWorkspace from './CubeWorkspace';
import RobotAgent from '../robots/RobotAgent';

export default function AgenticLab() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (hasWebGL === false) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20 text-primary/60 font-mono text-center p-8">
        <div>
          <p className="text-xl mb-4 font-bold tracking-tighter uppercase">3D Experience Unavailable</p>
          <p className="text-sm opacity-80">WebGL context blocked or unsupported. Please check your browser settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas 
        shadows 
        dpr={[1, 1.5]}
        gl={{ 
          antialias: false, 
          powerPreference: "default",
          preserveDrawingBuffer: false,
          alpha: true,
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('WebGL context lost. Attempting to restore...');
          }, false);
        }}
      >
        <PerspectiveCamera makeDefault position={[12, 10, 16]} fov={45} far={2000} />
        <OrbitControls 
          enablePan={true}
          screenSpacePanning={true} 
          maxPolarAngle={Math.PI / 1.8} 
          minDistance={8} 
          maxDistance={60}
          autoRotate
          autoRotateSpeed={0.3}
        />

        <Suspense fallback={null}>
          <CubeWorkspace />
          
          {/* Architect Agent - White Chrome @ Topology Panel */}
          <RobotAgent 
            position={[-4.5, -3.2, -3]} 
            color="#fcfcfc" 
            role="ARCHITECT" 
          />
          
          {/* Developer Agent - Silver Chrome @ Coding Terminal */}
          <RobotAgent 
            position={[2, -3.2, 4]} 
            color="#a0a0a0" 
            role="DEVELOPER" 
          />
          
          {/* Supervisor Agent - Black Chrome (Lead) @ Oversight Dashboard */}
          <RobotAgent 
            position={[0, -3.2, -5]} 
            color="#1a1a1a" 
            role="SUPERVISOR" 
            isLead={true}
          />


          <Environment preset="city" />
          <ContactShadows 
            position={[0, -4, 0]} 
            opacity={0.4} 
            scale={500} 
            blur={2} 
            far={4.5} 
          />
        </Suspense>

        {/* Cinematic Lighting System - Modern Three.js Intensities */}
        <ambientLight intensity={1.0} />
        <spotLight 
          position={[10, 20, 10]} 
          angle={0.2} 
          penumbra={1} 
          intensity={50} 
          castShadow 
        />
        <pointLight position={[-10, 10, -10]} intensity={20} color="#00aaff" />
        <pointLight position={[10, -5, 10]} intensity={10} color="#00f2ff" />
        <directionalLight position={[0, 10, 0]} intensity={2.0} />
      </Canvas>
    </div>
  );
}
