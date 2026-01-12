import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewcube,
  Stage,
  Environment,
  OrthographicCamera,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import { useState } from 'react';
import { OrthographicPerspectiveToggle } from '@/components/viewer/OrthographicPerspectiveToggle';
import { SelectionToolbar } from '@/components/viewer/SelectionToolbar';
import { SelectableModel } from '@/components/viewer/SelectableModel';
import { useAnnotations } from '@/contexts/AnnotationContext';

export function ThreeScene({ geometry }: { geometry: THREE.BufferGeometry }) {
  const [isOrthographic, setIsOrthographic] = useState(true);
  const { selectionMode } = useAnnotations();

  // Determine cursor style based on selection mode
  const cursorStyle = selectionMode !== 'none' ? 'crosshair' : 'grab';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        className="block h-full w-full"
        style={{ cursor: cursorStyle }}
      >
        <color attach="background" args={['#3B3B3B']} />
        {isOrthographic ? (
          <OrthographicCamera
            makeDefault
            position={[-100, 100, 100]}
            zoom={40}
            near={0.1}
            far={1000}
          />
        ) : (
          <PerspectiveCamera
            makeDefault
            position={[-100, 100, 100]}
            fov={45}
            near={0.1}
            far={1000}
            zoom={0.4}
          />
        )}
        <Stage environment={null} intensity={0.6} position={[0, 0, 0]}>
          <Environment files={`${import.meta.env.BASE_URL}/city.hdr`} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 5, 5]} intensity={0.2} />
          <directionalLight position={[-5, 5, -5]} intensity={0.2} />
          <directionalLight position={[0, 5, 0]} intensity={0.2} />
          <directionalLight position={[-5, -5, -5]} intensity={0.6} />
          <SelectableModel geometry={geometry} />
        </Stage>
        <OrbitControls
          makeDefault
          enableDamping={true}
          dampingFactor={0.05}
          // Disable orbit controls when in selection mode to allow clicking
          enabled={selectionMode === 'none'}
        />
        <GizmoHelper alignment="bottom-right" margin={[80, 90]}>
          <GizmoViewcube />
        </GizmoHelper>
      </Canvas>

      {/* Selection toolbar */}
      <div className="absolute left-2 top-2">
        <SelectionToolbar />
      </div>

      <div className="absolute bottom-2 right-9 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <OrthographicPerspectiveToggle
            isOrthographic={isOrthographic}
            onToggle={setIsOrthographic}
          />
        </div>
      </div>
    </div>
  );
}
