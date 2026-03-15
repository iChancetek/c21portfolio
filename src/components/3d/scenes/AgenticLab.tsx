'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import CubeWorkspace from './CubeWorkspace';
import RobotAgent from '../robots/RobotAgent';

export default function AgenticLab() {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[12, 10, 16]} fov={45} />
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
            scale={100}
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
