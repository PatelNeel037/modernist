'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

function AbstractShape() {
    const meshRef = useRef<THREE.Mesh>(null);

    // Slowly rotate on every frame
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.1;
            meshRef.current.rotation.y += delta * 0.15;
            meshRef.current.rotation.z += delta * 0.05;
        }
    });

    return (
        <Float rotationIntensity={1.5} floatIntensity={2} speed={1.5}>
            <mesh ref={meshRef} position={[0, 0.5, 0]}>
                <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
                <meshStandardMaterial
                    color="#e0e0e0"
                    metalness={0.6}
                    roughness={0.2}
                />
            </mesh>
        </Float>
    );
}

export default function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ powerPreference: "high-performance", antialias: false }}
            >
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={1} castShadow />

                <Suspense fallback={null}>
                    <PresentationControls
                        global
                        rotation={[0, 0, 0]}
                        polar={[-0.4, 0.2]}
                        azimuth={[-1, 0.75]}
                        snap={true}
                    >
                        <AbstractShape />
                    </PresentationControls>

                    <Environment preset="city" />
                    <ContactShadows position={[0, -1.8, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
                </Suspense>
            </Canvas>
        </div>
    );
}
