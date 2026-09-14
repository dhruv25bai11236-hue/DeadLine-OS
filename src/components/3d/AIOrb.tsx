import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';

export const AIOrb = () => {
  const meshRef = useRef<Mesh>(null);
  const ringRef1 = useRef<Mesh>(null);
  const ringRef2 = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.15;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.x = Math.sin(t * 0.8) * 0.1;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += 0.012;
      ringRef1.current.rotation.x = t * 0.5;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= 0.009;
      ringRef2.current.rotation.y = t * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshPhysicalMaterial
          color="#4338ca"
          emissive="#6366f1"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.4}
          ior={1.5}
        />
      </mesh>

      {/* Outer Gyroscope Ring 1 */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[1.35, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Outer Gyroscope Ring 2 */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[1.55, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};
