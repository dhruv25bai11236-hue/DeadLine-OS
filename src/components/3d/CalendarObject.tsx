import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Float } from '@react-three/drei';

interface CalendarObjectProps {
  position: [number, number, number];
}

export const CalendarObject = ({ position }: CalendarObjectProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.008;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <cylinderGeometry args={[0.55, 0.55, 0.12, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};
