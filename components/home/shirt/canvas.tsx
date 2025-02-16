'use client'
import { Center, Environment, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Euler } from 'three';

type CameraRigProps = {
  children: React.ReactNode;
};

const CameraRig = React.memo(({ children }: CameraRigProps) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      easing.damp3(state.camera.position, [0, 0, 2], 0.25, delta);
      easing.dampE(groupRef.current.rotation, [state.pointer.y / 12, -state.pointer.x / 8, 0], 0.25, delta);
    }
  });
  return <group ref={groupRef}>{children}</group>;
});

type ShirtProps = JSX.IntrinsicElements['mesh'];

const Shirt = React.memo((props: ShirtProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const { nodes, materials } = useGLTF('/home/camiseta.glb') as any;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 0.05 + Math.sin(t / 2) * 0.02;
    }
  });

  const rotation = useMemo(() => new Euler(
    THREE.MathUtils.degToRad(-10),
    THREE.MathUtils.degToRad(-25),
    THREE.MathUtils.degToRad(0)
  ), []);

  if (!nodes || !nodes.T_Shirt_male) {
    return null;
  }

  // Crear una luz que simule el resplandor del sol
  const rimLight = useMemo(() => new THREE.SpotLight(0x4A90E2, 5), []);
  rimLight.position.set(2, 2, 2);
  rimLight.angle = Math.PI / 4;
  rimLight.penumbra = 0.5;
  rimLight.decay = 2;

  return (
    <>
      <primitive object={rimLight} />
      {ref.current && <primitive object={rimLight.target} />}
      <mesh
        ref={ref}
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        rotation={rotation}
        {...props}
      />
    </>
  );
});

const App = () => (
  <>
    <Canvas
      className="w-2/4 h-max"
      camera={{ position: [0, 0, 10], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
    >
      <Environment files="/home/venice_sunset_1k2.hdr" />
      <directionalLight color="#83b5ff" intensity={1} position={[5, 3, 5]} />
      <CameraRig>
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  </>
);

export default App;

