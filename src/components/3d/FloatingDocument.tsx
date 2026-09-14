import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Float } from '@react-three/drei';

interface FloatingDocumentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

export const FloatingDocument = ({
  position,
  rotation = [0, 0, 0],
  color = '#ffffff',
}: FloatingDocumentProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.004;
  });

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2} floatingRange={[-0.15, 0.15]}>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        <boxGeometry args={[0.9, 1.25, 0.04]} />
        <meshPhysicalMaterial
          color={hovered ? '#4f46e5' : color}
          emissive={hovered ? '#6366f1' : '#f8fafc'}
          emissiveIntensity={hovered ? 0.4 : 0.1}
          roughness={0.15}
          metalness={0.1}
          clearcoat={1}
          transmission={0.3}
          transparent={true}
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
};
