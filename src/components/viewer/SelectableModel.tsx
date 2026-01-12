import { useRef, useCallback, useMemo, useState } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnnotations } from '@/contexts/AnnotationContext';
import { useColor } from '@/contexts/ColorContext';
import { ANNOTATION_COLORS } from '@/types/annotations';
import { Line } from '@react-three/drei';

interface SelectableModelProps {
  geometry: THREE.BufferGeometry;
}

// Helper to find the closest edge to a point
function findClosestEdge(
  point: THREE.Vector3,
  edges: Array<{ start: THREE.Vector3; end: THREE.Vector3; index: number }>,
  threshold: number = 2
): { start: THREE.Vector3; end: THREE.Vector3; index: number } | null {
  let closest: { start: THREE.Vector3; end: THREE.Vector3; index: number } | null = null;
  let minDist = threshold;

  for (const edge of edges) {
    // Calculate distance from point to line segment
    const line = new THREE.Line3(edge.start, edge.end);
    const closestPoint = new THREE.Vector3();
    line.closestPointToPoint(point, true, closestPoint);
    const dist = point.distanceTo(closestPoint);

    if (dist < minDist) {
      minDist = dist;
      closest = edge;
    }
  }

  return closest;
}

export function SelectableModel({ geometry }: SelectableModelProps) {
  const { color } = useColor();
  const meshRef = useRef<THREE.Mesh>(null);

  const {
    selectionMode,
    selectionState,
    setHoveredFace,
    setHoveredPoint,
    setHoveredEdge,
    addFaceFromRaycast,
    addPointAnnotation,
    addEdgeFromPoints,
    annotations,
  } = useAnnotations();

  const [hoveredFaceIndex, setLocalHoveredFaceIndex] = useState<number | null>(null);
  const [hoveredEdgeIndex, setLocalHoveredEdgeIndex] = useState<number | null>(null);

  // Extract edges from geometry using EdgesGeometry
  const edges = useMemo(() => {
    if (!geometry) return [];

    const edgesGeom = new THREE.EdgesGeometry(geometry, 30); // 30 degree threshold
    const positions = edgesGeom.getAttribute('position');
    if (!positions) return [];

    const edgeList: Array<{ start: THREE.Vector3; end: THREE.Vector3; index: number }> = [];

    for (let i = 0; i < positions.count; i += 2) {
      const start = new THREE.Vector3(
        positions.getX(i),
        positions.getY(i),
        positions.getZ(i)
      );
      const end = new THREE.Vector3(
        positions.getX(i + 1),
        positions.getY(i + 1),
        positions.getZ(i + 1)
      );
      edgeList.push({ start, end, index: i / 2 });
    }

    return edgeList;
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
        setLocalHoveredEdgeIndex(null);
        setHoveredFace(null);
        setHoveredEdge(null);
        return;
      }

      event.stopPropagation();

      if (selectionMode === 'face' && event.faceIndex !== undefined) {
        setLocalHoveredFaceIndex(event.faceIndex);
        setLocalHoveredEdgeIndex(null);
        setHoveredFace(event.faceIndex);
        setHoveredEdge(null);
      } else if (selectionMode === 'edge' && event.point) {
        // Find closest edge to the intersection point
        const closestEdge = findClosestEdge(event.point, edges, 3);
        if (closestEdge) {
          setLocalHoveredEdgeIndex(closestEdge.index);
          setHoveredEdge({ start: closestEdge.start, end: closestEdge.end });
        } else {
          setLocalHoveredEdgeIndex(null);
          setHoveredEdge(null);
        }
        setLocalHoveredFaceIndex(null);
        setHoveredFace(null);
      } else if (selectionMode === 'point' && event.point) {
        setHoveredPoint(event.point.clone());
        setLocalHoveredFaceIndex(null);
        setLocalHoveredEdgeIndex(null);
      }
    },
    [selectionMode, setHoveredFace, setHoveredPoint, setHoveredEdge, edges]
  );

  // Handle pointer leave
  const handlePointerLeave = useCallback(() => {
    setLocalHoveredFaceIndex(null);
    setLocalHoveredEdgeIndex(null);
    setHoveredFace(null);
    setHoveredPoint(null);
    setHoveredEdge(null);
  }, [setHoveredFace, setHoveredPoint, setHoveredEdge]);

  // Handle click to add annotation
  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (selectionMode === 'none' || !meshRef.current) return;

      event.stopPropagation();

      if (selectionMode === 'face' && event.faceIndex !== undefined) {
        addFaceFromRaycast(event.faceIndex, geometry);
      } else if (selectionMode === 'edge' && event.point) {
        const closestEdge = findClosestEdge(event.point, edges, 3);
        if (closestEdge) {
          addEdgeFromPoints(closestEdge.start, closestEdge.end);
        }
      } else if (selectionMode === 'point' && event.point) {
        addPointAnnotation(event.point.clone());
      }
    },
    [selectionMode, geometry, edges, addFaceFromRaycast, addPointAnnotation, addEdgeFromPoints]
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
      if (!positionAttr) return null;

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
    return Array.from(annotatedFaceIndices)
      .map((faceIndex) => createFaceHighlightGeometry(faceIndex, geometry))
      .filter((geom): geom is THREE.BufferGeometry => geom !== null);
  }, [geometry, annotatedFaceIndices, createFaceHighlightGeometry]);

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

      {/* Hover highlight for edge mode */}
      {hoveredEdgeIndex !== null && selectionMode === 'edge' && edges[hoveredEdgeIndex] && (
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Line
            points={[
              [edges[hoveredEdgeIndex].start.x, edges[hoveredEdgeIndex].start.y, edges[hoveredEdgeIndex].start.z],
              [edges[hoveredEdgeIndex].end.x, edges[hoveredEdgeIndex].end.y, edges[hoveredEdgeIndex].end.z],
            ]}
            color={ANNOTATION_COLORS.hover}
            lineWidth={4}
          />
        </group>
      )}

      {/* Selected edge annotations */}
      {annotations
        .filter((ann) => ann.type === 'edge' && ann.visible)
        .map((ann) => {
          if (ann.type !== 'edge') return null;
          return (
            <group key={ann.id} rotation={[-Math.PI / 2, 0, 0]}>
              <Line
                points={[
                  [ann.startPoint.x, ann.startPoint.y, ann.startPoint.z],
                  [ann.endPoint.x, ann.endPoint.y, ann.endPoint.z],
                ]}
                color={ann.color || ANNOTATION_COLORS.edge}
                lineWidth={3}
              />
            </group>
          );
        })}

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
