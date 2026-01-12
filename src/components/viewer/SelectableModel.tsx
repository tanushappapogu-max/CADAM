import { useRef, useCallback, useMemo, useState } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnnotations } from '@/contexts/AnnotationContext';
import { useColor } from '@/contexts/ColorContext';
import { ANNOTATION_COLORS } from '@/types/annotations';

interface SelectableModelProps {
  geometry: THREE.BufferGeometry;
}

export function SelectableModel({ geometry }: SelectableModelProps) {
  const { color } = useColor();
  const meshRef = useRef<THREE.Mesh>(null);

  const {
    selectionMode,
    selectionState,
    setHoveredFace,
    setHoveredPoint,
    addFaceFromRaycast,
    addPointAnnotation,
    annotations,
  } = useAnnotations();

  const [hoveredFaceIndex, setLocalHoveredFaceIndex] = useState<number | null>(null);

  // Create a geometry for highlighting hovered/selected faces
  const highlightGeometry = useMemo(() => {
    if (!geometry) return null;

    // Clone the geometry for highlighting
    const highlightGeom = geometry.clone();
    return highlightGeom;
  }, [geometry]);

  // Get face indices that are annotated
  const annotatedFaceIndices = useMemo(() => {
    const indices = new Set<number>();
    annotations.forEach((ann) => {
      if (ann.type === 'face' && ann.visible) {
        ann.faceIndices.forEach((idx) => indices.add(idx));
      }
    });
    return indices;
  }, [annotations]);

  // Handle pointer move for hover effects
  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (selectionMode === 'none' || !meshRef.current) {
        setLocalHoveredFaceIndex(null);
        setHoveredFace(null);
        return;
      }

      event.stopPropagation();

      if (selectionMode === 'face' && event.faceIndex !== undefined) {
        setLocalHoveredFaceIndex(event.faceIndex);
        setHoveredFace(event.faceIndex);
      } else if (selectionMode === 'point' && event.point) {
        setHoveredPoint(event.point.clone());
      }
    },
    [selectionMode, setHoveredFace, setHoveredPoint]
  );

  // Handle pointer leave
  const handlePointerLeave = useCallback(() => {
    setLocalHoveredFaceIndex(null);
    setHoveredFace(null);
    setHoveredPoint(null);
  }, [setHoveredFace, setHoveredPoint]);

  // Handle click to add annotation
  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (selectionMode === 'none' || !meshRef.current) return;

      event.stopPropagation();

      if (selectionMode === 'face' && event.faceIndex !== undefined) {
        addFaceFromRaycast(event.faceIndex, geometry);
      } else if (selectionMode === 'point' && event.point) {
        addPointAnnotation(event.point.clone());
      }
    },
    [selectionMode, geometry, addFaceFromRaycast, addPointAnnotation]
  );

  // Create highlight materials
  const hoverMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ANNOTATION_COLORS.hover,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: false,
      }),
    []
  );

  const selectedMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ANNOTATION_COLORS.face,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: false,
      }),
    []
  );

  // Create geometry for single face highlight
  const createFaceHighlightGeometry = useCallback(
    (faceIndex: number, sourceGeometry: THREE.BufferGeometry) => {
      const positionAttr = sourceGeometry.getAttribute('position');
      const indexAttr = sourceGeometry.getIndex();

      // Get vertex indices for the face
      let i0: number, i1: number, i2: number;
      if (indexAttr) {
        i0 = indexAttr.getX(faceIndex * 3);
        i1 = indexAttr.getX(faceIndex * 3 + 1);
        i2 = indexAttr.getX(faceIndex * 3 + 2);
      } else {
        i0 = faceIndex * 3;
        i1 = faceIndex * 3 + 1;
        i2 = faceIndex * 3 + 2;
      }

      // Create a small geometry for just this face
      const vertices = new Float32Array([
        positionAttr.getX(i0), positionAttr.getY(i0), positionAttr.getZ(i0),
        positionAttr.getX(i1), positionAttr.getY(i1), positionAttr.getZ(i1),
        positionAttr.getX(i2), positionAttr.getY(i2), positionAttr.getZ(i2),
      ]);

      const faceGeom = new THREE.BufferGeometry();
      faceGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      faceGeom.computeVertexNormals();

      return faceGeom;
    },
    []
  );

  // Create hover face geometry
  const hoverFaceGeometry = useMemo(() => {
    if (hoveredFaceIndex === null || !geometry) return null;
    return createFaceHighlightGeometry(hoveredFaceIndex, geometry);
  }, [hoveredFaceIndex, geometry, createFaceHighlightGeometry]);

  // Create selected faces geometries
  const selectedFaceGeometries = useMemo(() => {
    if (!geometry || annotatedFaceIndices.size === 0) return [];
    return Array.from(annotatedFaceIndices).map((faceIndex) =>
      createFaceHighlightGeometry(faceIndex, geometry)
    );
  }, [geometry, annotatedFaceIndices, createFaceHighlightGeometry]);

  // Cursor style based on selection mode
  const cursorStyle = selectionMode !== 'none' ? 'crosshair' : 'default';

  return (
    <group>
      {/* Main mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Hover highlight for face mode */}
      {hoverFaceGeometry && selectionMode === 'face' && (
        <mesh
          geometry={hoverFaceGeometry}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]} // Slight offset to prevent z-fighting
          material={hoverMaterial}
        />
      )}

      {/* Selected face highlights */}
      {selectedFaceGeometries.map((geom, index) => (
        <mesh
          key={`selected-face-${index}`}
          geometry={geom}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.005, 0]}
          material={selectedMaterial}
        />
      ))}

      {/* Point annotations visualization */}
      {annotations
        .filter((ann) => ann.type === 'point' && ann.visible)
        .map((ann) => {
          if (ann.type !== 'point') return null;
          // Transform position to match the rotated geometry
          const transformedPos = ann.position.clone();
          // Apply the inverse rotation to display in correct position
          const rotatedPos = new THREE.Vector3(
            transformedPos.x,
            -transformedPos.z,
            transformedPos.y
          );
          return (
            <mesh key={ann.id} position={rotatedPos}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial color={ann.color || ANNOTATION_COLORS.point} />
            </mesh>
          );
        })}

      {/* Hover point indicator */}
      {selectionState.hoveredPoint && selectionMode === 'point' && (
        <mesh
          position={[
            selectionState.hoveredPoint.x,
            -selectionState.hoveredPoint.z,
            selectionState.hoveredPoint.y,
          ]}
        >
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial
            color={ANNOTATION_COLORS.hover}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  );
}
