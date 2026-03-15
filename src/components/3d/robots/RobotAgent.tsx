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

  // Ultra-Stable Chrome Materials - Using Phong for broader GPU compatibility
  // Ultra-Premium Chrome Materials - High Compatibility Version
  const robotMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    shininess: 120,
    specular: new THREE.Color('#ffffff'),
    reflectivity: 1
  }), [color]);

  const jointMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    color: '#111111',
    shininess: 40,
    specular: new THREE.Color('#333333'),
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#00f2ff',
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (group.current && upperBody.current) {
      // Idle Breathing - Animation applied to internal components to avoid position conflicts
      upperBody.current.position.y = Math.sin(time * 0.4) * 0.05;
      
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
      {/* Animated Core Group */}
      <group ref={upperBody}>
        {/* Torso */}
        <Box args={[0.5, 0.7, 0.3]} material={robotMaterial} />
        
        {/* Articulated Shoulders */}
        <Sphere args={[0.12, 16, 16]} position={[-0.3, 0.3, 0]} material={jointMaterial} />
        <Sphere args={[0.12, 16, 16]} position={[0.3, 0.3, 0]} material={jointMaterial} />

        {/* Head */}
        <group ref={head} position={[0, 0.6, 0]}>
          <Box args={[0.3, 0.4, 0.25]} material={robotMaterial} />
          {/* Glowing Eyes */}
          <group position={[0, 0.05, 0.13]}>
             <mesh position={[-0.08, 0, 0]} material={eyeMaterial}>
               <planeGeometry args={[0.08, 0.02]} />
             </mesh>
             <mesh position={[0.08, 0, 0]} material={eyeMaterial}>
               <planeGeometry args={[0.08, 0.02]} />
             </mesh>
             <pointLight position={[0, 0, 0.1]} intensity={5} distance={3} color="#00f2ff" />
          </group>
        </group>

        {/* Articulated Arms */}
        <group ref={leftArm} position={[-0.3, 0.3, 0]}>
          <Cylinder args={[0.06, 0.05, 0.5, 8]} position={[0, -0.25, 0]} material={robotMaterial} />
          <Sphere args={[0.07, 12, 12]} position={[0, -0.5, 0]} material={jointMaterial} />
        </group>
        <group ref={rightArm} position={[0.3, 0.3, 0]}>
          <Cylinder args={[0.06, 0.05, 0.5, 8]} position={[0, -0.25, 0]} material={robotMaterial} />
          <Sphere args={[0.07, 12, 12]} position={[0, -0.5, 0]} material={jointMaterial} />
        </group>
      </group>

      {/* Static Leg Structure */}
      <group position={[0, -0.35, 0]}>
        <group ref={leftLeg} position={[-0.18, 0, 0]}>
          <Cylinder args={[0.08, 0.06, 0.7, 8]} position={[0, -0.35, 0]} material={robotMaterial} />
        </group>
        <group ref={rightLeg} position={[0.18, 0, 0]}>
          <Cylinder args={[0.08, 0.06, 0.7, 8]} position={[0, -0.35, 0]} material={robotMaterial} />
        </group>
      </group>

      {/* Floating Identity Label */}
      <Suspense fallback={null}>
        <DreiText
          position={[0, 1.2, 0]}
          fontSize={0.15}
          color="#00f2ff"
          anchorX="center"
          maxWidth={2}
          textAlign="center"
        >
          {role} {isLead && "\n(LEAD AGENT)"}
        </DreiText>
      </Suspense>
    </group>
  );
}
