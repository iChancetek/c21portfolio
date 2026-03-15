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

  // Ultra-Premium Chrome - Physically Stable Version
  const robotMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 1.0,
    roughness: 0.15,
    envMapIntensity: 1.5,
  }), [color]);

  const jointMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#111111',
    metalness: 0.8,
    roughness: 0.3,
  }), []);

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
        head.current.rotation.x = Math.sin(time * 0.3) * 0.08;
      }

      // Role-Specific Animations
      if (role === 'DEVELOPER') {
        const typingSpeed = 15;
        if (leftArm.current && rightArm.current) {
          leftArm.current.rotation.x = -1.2 + Math.sin(time * typingSpeed) * 0.15;
          rightArm.current.rotation.x = -1.2 + Math.cos(time * (typingSpeed + 2)) * 0.15;
          leftArm.current.rotation.z = 0.3;
          rightArm.current.rotation.z = -0.3;
        }
      } else if (role === 'ARCHITECT') {
        if (rightArm.current) {
          rightArm.current.rotation.x = -1.4 + Math.sin(time * 1.5) * 0.4;
          rightArm.current.rotation.y = Math.cos(time * 1.5) * 0.2;
        }
        if (leftArm.current) {
          leftArm.current.rotation.x = -0.4 + Math.sin(time * 0.5) * 0.1;
        }
      } else if (role === 'SUPERVISOR') {
        if (leftArm.current && rightArm.current) {
          leftArm.current.rotation.z = 0.5;
          rightArm.current.rotation.z = -0.5;
          leftArm.current.rotation.x = -0.2;
          rightArm.current.rotation.x = -0.2;
        }
        if (upperBody.current) {
          upperBody.current.rotation.y = Math.sin(time * 0.5) * 0.12;
        }
      }
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Upper Body Group */}
      <group ref={upperBody}>
        {/* Torso */}
        <Box args={[0.4, 0.6, 0.25]} material={robotMaterial} />
        
        {/* Articulated Shoulders */}
        <Sphere args={[0.1, 24, 24]} position={[-0.25, 0.25, 0]} material={jointMaterial} />
        <Sphere args={[0.1, 24, 24]} position={[0.25, 0.25, 0]} material={jointMaterial} />

        {/* Head */}
        <group ref={head} position={[0, 0.5, 0]}>
          <Box args={[0.24, 0.3, 0.2]} material={robotMaterial} />
          {/* Glowing Eyes */}
          <group position={[0, 0.05, 0.1]}>
             <mesh position={[-0.07, 0, 0]} material={eyeMaterial}>
               <planeGeometry args={[0.06, 0.015]} />
             </mesh>
             <mesh position={[0.07, 0, 0]} material={eyeMaterial}>
               <planeGeometry args={[0.06, 0.015]} />
             </mesh>
             <pointLight position={[0, 0, 0.1]} intensity={0.8} distance={1} color="#00f2ff" />
          </group>
        </group>

        {/* Articulated Arms */}
        <group ref={leftArm} position={[-0.25, 0.25, 0]}>
          <Cylinder args={[0.045, 0.04, 0.4]} position={[0, -0.2, 0]} material={robotMaterial} />
          <Sphere args={[0.05, 16, 16]} position={[0, -0.4, 0]} material={jointMaterial} />
          <Cylinder args={[0.035, 0.03, 0.3]} position={[0, -0.55, 0]} material={robotMaterial} />
        </group>
        <group ref={rightArm} position={[0.25, 0.25, 0]}>
          <Cylinder args={[0.045, 0.04, 0.4]} position={[0, -0.2, 0]} material={robotMaterial} />
          <Sphere args={[0.05, 16, 16]} position={[0, -0.4, 0]} material={jointMaterial} />
          <Cylinder args={[0.035, 0.03, 0.3]} position={[0, -0.55, 0]} material={robotMaterial} />
        </group>
      </group>

      {/* Articulated Legs */}
      <group ref={leftLeg} position={[-0.15, -0.3, 0]}>
        <Sphere args={[0.08, 16, 16]} position={[0, 0, 0]} material={jointMaterial} />
        <Cylinder args={[0.06, 0.04, 0.6]} position={[0, -0.3, 0]} material={robotMaterial} />
      </group>
      <group ref={rightLeg} position={[0.15, -0.3, 0]}>
        <Sphere args={[0.08, 16, 16]} position={[0, 0, 0]} material={jointMaterial} />
        <Cylinder args={[0.06, 0.04, 0.6]} position={[0, -0.3, 0]} material={robotMaterial} />
      </group>

      {/* Role Tag Overlay */}
      <DreiText
        position={[0, 1.0, 0]}
        fontSize={0.12}
        color={isLead ? "#ffffff" : "#00f2ff"}
        anchorX="center"
      >
        {role} {isLead && "• LEAD"}
      </DreiText>
    </group>
  );
}
