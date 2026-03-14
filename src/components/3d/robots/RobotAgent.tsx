'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box, Text as DreiText } from '@react-three/drei';
import * as THREE from 'three';

interface RobotProps {
  position: [number, number, number];
  color: string;
  role: 'ARCHITECT' | 'DEVELOPER' | 'SUPERVISOR';
  isLead?: boolean;
}

export default function RobotAgent({ position, color, role, isLead = false }: RobotProps) {
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const upperBody = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  // Premium PBR Materials (Stable Version)
  const robotMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 1,
    roughness: 0.05,
  }), [color]);

  const eyeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00f2ff',
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (group.current) {
      // Idle Breathing
      group.current.position.y = position[1] + Math.sin(time * 0.4) * 0.03;
      
      if (head.current) {
        head.current.rotation.y = Math.sin(time * 0.2) * 0.15;
      }

      // Role-Specific Animations
      if (role === 'DEVELOPER') {
        if (leftArm.current && rightArm.current) {
          leftArm.current.rotation.x = -1.2 + Math.sin(time * 15) * 0.1;
          rightArm.current.rotation.x = -1.2 + Math.cos(time * 17) * 0.1;
          leftArm.current.rotation.z = 0.2;
          rightArm.current.rotation.z = -0.2;
        }
      } else if (role === 'ARCHITECT') {
        if (rightArm.current) {
          rightArm.current.rotation.x = -1.5 + Math.sin(time * 1.5) * 0.5;
          rightArm.current.rotation.y = Math.cos(time * 1.5) * 0.3;
        }
        if (leftArm.current) {
          leftArm.current.rotation.x = -0.5 + Math.sin(time * 0.5) * 0.1;
        }
      } else if (role === 'SUPERVISOR') {
        if (leftArm.current && rightArm.current) {
          leftArm.current.rotation.z = 0.5;
          rightArm.current.rotation.z = -0.5;
          leftArm.current.rotation.x = -0.2;
          rightArm.current.rotation.x = -0.2;
        }
        if (upperBody.current) {
          upperBody.current.rotation.y = Math.sin(time * 0.5) * 0.1;
        }
      }
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Upper Body Group */}
      <group ref={upperBody}>
        {/* Torso */}
        <Box args={[0.5, 0.7, 0.3]} material={robotMaterial} />
        
        {/* Shoulders */}
        <Sphere args={[0.12, 16, 16]} position={[-0.3, 0.3, 0]} material={robotMaterial} />
        <Sphere args={[0.12, 16, 16]} position={[0.3, 0.3, 0]} material={robotMaterial} />

        {/* Head */}
        <group ref={head} position={[0, 0.6, 0]}>
          <Box args={[0.3, 0.4, 0.25]} material={robotMaterial} />
          {/* Glowing Eyes */}
          <mesh position={[-0.08, 0.05, 0.13]} material={eyeMaterial}>
            <planeGeometry args={[0.06, 0.02]} />
          </mesh>
          <mesh position={[0.08, 0.05, 0.13]} material={eyeMaterial}>
            <planeGeometry args={[0.06, 0.02]} />
          </mesh>
        </group>

        {/* Arms */}
        <group ref={leftArm} position={[-0.3, 0.3, 0]}>
          <Cylinder args={[0.06, 0.05, 0.5]} position={[0, -0.25, 0]} material={robotMaterial} />
          <Sphere args={[0.07, 16, 16]} position={[0, -0.5, 0]} material={robotMaterial} />
        </group>
        <group ref={rightArm} position={[0.3, 0.3, 0]}>
          <Cylinder args={[0.06, 0.05, 0.5]} position={[0, -0.25, 0]} material={robotMaterial} />
          <Sphere args={[0.07, 16, 16]} position={[0, -0.5, 0]} material={robotMaterial} />
        </group>
      </group>

      {/* Legs */}
      <group ref={leftLeg} position={[-0.18, -0.35, 0]}>
        <Cylinder args={[0.08, 0.06, 0.7]} position={[0, -0.35, 0]} material={robotMaterial} />
      </group>
      <group ref={rightLeg} position={[0.18, -0.35, 0]}>
        <Cylinder args={[0.08, 0.06, 0.7]} position={[0, -0.35, 0]} material={robotMaterial} />
      </group>

      {/* Role Tag Overlay */}
      <DreiText
        position={[0, 1.1, 0]}
        fontSize={0.12}
        color={isLead ? "#ffffff" : "#00f2ff"}
        anchorX="center"
      >
        {role} {isLead && "• LEAD"}
      </DreiText>
    </group>
  );
}
