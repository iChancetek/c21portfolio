'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text as DreiText, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export function HolographicPanel({ position, rotation, title, content, type = 'info' }: any) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position} rotation={rotation}>
        {/* Panel Glass */}
        <mesh>
          <planeGeometry args={[2.5, 1.5]} />
          <meshPhongMaterial 
            color="#0066ff" 
            transparent 
            opacity={0.15} 
            shininess={100}
            side={THREE.DoubleSide} 
          />
        </mesh>
        
        {/* Glowing Borders */}
        <mesh>
          <boxGeometry args={[2.6, 1.6, 0.02]} />
          <meshBasicMaterial color="#00ddff" wireframe transparent opacity={0.3} />
        </mesh>

        <DreiText
          position={[0, 0.5, 0.05]}
          fontSize={0.12}
          color="#00f2ff"
          anchorX="center"
        >
          {title}
        </DreiText>
        
        <DreiText
          position={[0, -0.1, 0.05]}
          fontSize={0.08}
          color="#88ffff"
          maxWidth={2.2}
          anchorX="center"
          lineHeight={1.4}
        >
          {content}
        </DreiText>

        {type === 'code' && (
          <group position={[0, -0.4, 0.05]}>
            {[...Array(10)].map((_, i) => (
              <mesh key={i} position={[(i * 0.2) - 0.9, 0, 0]}>
                <boxGeometry args={[0.1, Math.random() * 0.4, 0.01]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </Float>
  );
}

export default function CubeWorkspace() {
  return (
    <group>
      {/* Central Metallic Cube Frame with Glow */}
      <mesh>
        <boxGeometry args={[12, 10, 12]} />
        <meshBasicMaterial color="#0088ff" wireframe transparent opacity={0.1} />
      </mesh>
      
      {/* Structural Corner Pillars */}
      {[[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([x, z], i) => (
        <Cylinder key={i} args={[0.05, 0.05, 10]} position={[x, 0, z]}>
          <meshStandardMaterial color="#333333" metalness={1} roughness={0.1} />
        </Cylinder>
      ))}

      {/* 1. ARCHITECT STATION */}
      <HolographicPanel 
        position={[-4.5, 2, -3]} 
        rotation={[0, 0.6, 0]} 
        type="diagram"
        title="SYSTEM TOPOLOGY" 
        content="Microservice Alpha: Online\nData Bus: 14.5 GB/s\nActive Agents: 100%" 
      />

      {/* 2. DEVELOPER STATION */}
      <HolographicPanel 
        position={[2, 0, 4]} 
        rotation={[0, -0.4, 0]} 
        type="code"
        title="MODULE COMPILER" 
        content="> npm run build\n> Chunk 14: SUCCESS\n> Optimizing..." 
      />
      
      {/* 3. SUPERVISOR STATION */}
      <HolographicPanel 
        position={[0, 3.5, -5]} 
        rotation={[0, 0, 0]} 
        title="MISSION STATUS" 
        content="Goal: AI Portfolio Deployment\nVelocity: 94%\nPriority: CRITICAL" 
      />

      <gridHelper args={[500, 200, '#004488', '#001122']} position={[0, -4, 0]} />
      <pointLight position={[0, 4, 0]} intensity={2} color="#00ccff" />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={15} color="#00ffff" castShadow />
    </group>
  );
}
