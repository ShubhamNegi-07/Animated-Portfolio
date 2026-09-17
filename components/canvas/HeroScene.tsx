"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

function Orb() {
  const mesh = useRef<Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.12;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.55}>
      <mesh ref={mesh} scale={1.65}>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial
          color="#c8a46b"
          distort={0.32}
          speed={1.4}
          roughness={0.18}
          metalness={0.72}
          emissive="#3a2a12"
          emissiveIntensity={0.35}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 3, 5]} intensity={1.4} color="#fff4d6" />
      <pointLight position={[-4, -2, -2]} intensity={0.6} color="#7aa0ff" />
      <Orb />
    </Canvas>
  );
}
