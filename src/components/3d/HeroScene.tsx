import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { AIOrb } from './AIOrb';
import { FloatingDocument } from './FloatingDocument';
import { CalendarObject } from './CalendarObject';

export const HeroScene = () => {
  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 12, 6]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-10, -6, -4]} intensity={0.8} color="#818cf8" />
        <pointLight position={[0, 1.5, 1]} intensity={1.5} color="#6366f1" />

        {/* Central Core floating behind and slightly above the text zone */}
        <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.6} floatingRange={[-0.15, 0.15]}>
          <group position={[0, 0.4, -1.2]} scale={1.15}>
            <AIOrb />
          </group>
        </Float>

        {/* Floating task documents framing the sides */}
        <FloatingDocument position={[-3.2, 1.3, 0.2]} rotation={[0.15, 0.45, -0.1]} color="#ffffff" />
        <FloatingDocument position={[3.3, 1.1, 0.4]} rotation={[-0.15, -0.4, 0.08]} color="#f8fafc" />
        <FloatingDocument position={[-2.8, -1.6, -0.2]} rotation={[0.1, 0.3, 0.15]} color="#ede9fe" />
        <FloatingDocument position={[2.9, -1.5, 0.1]} rotation={[-0.12, -0.25, -0.1]} color="#e0e7ff" />

        {/* Floating calendar marker */}
        <CalendarObject position={[3.4, -0.2, -0.5]} />
      </Canvas>
    </div>
  );
};
