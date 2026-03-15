'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import CubeWorkspace from './CubeWorkspace';
import RobotAgent from '../robots/RobotAgent';

export default function AgenticLab() {
  return (
    <div className="w-full h-full">
      <Canvas 
        shadows 
        dpr={[1, 1.5]}
        gl={{ 
          antialias: false, 
          powerPreference: "default",
          stencil: false,
          depth: true,
          alpha: true
        }}
      >
        <PerspectiveCamera makeDefault position={[12, 10, 16]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 1.8} 
          minDistance={8} 
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.5}
        />

        <CubeWorkspace />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          {/* Architect Agent - White Chrome */}
          <RobotAgent 
            position={[-5, -3.2, -2]} 
            color="#ffffff" 
            role="ARCHITECT" 
          />
          
          {/* Developer Agent - Silver Chrome */}
          <RobotAgent 
            position={[3, -3.2, 5]} 
            color="#cccccc" 
            role="DEVELOPER" 
          />
          
          {/* Supervisor Agent - Dark Chrome (Lead) */}
          <RobotAgent 
            position={[0, -3.2, -5]} 
            color="#222222" 
            role="SUPERVISOR" 
            isLead={true}
          />
        </Suspense>

        {/* Cinematic Lighting System - Maximum Visibility */}
        <ambientLight intensity={1.5} />
        <spotLight 
          position={[20, 30, 20]} 
          angle={0.2} 
          penumbra={1} 
          intensity={50} 
          castShadow 
        />
        <pointLight position={[-15, 10, -15]} intensity={30} color="#00f2ff" />
        <directionalLight position={[0, 20, 0]} intensity={15} color="#ffffff" />
      </Canvas>
    </div>
  );
}
