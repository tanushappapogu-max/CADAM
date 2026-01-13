import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import * as THREE from 'three';
import {
  Annotation,
  FaceAnnotation,
  EdgeAnnotation,
  PointAnnotation,
  SelectionMode,
  SelectionState,
  createAnnotationId,
  ANNOTATION_COLORS,
  annotationsToPromptContext,
} from '@/types/annotations';

interface AnnotationContextType {
  // Annotations list
  annotations: Annotation[];
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt' | 'visible'>) => Annotation;
  removeAnnotation: (id: string) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  clearAnnotations: () => void;

  // Selection mode
  selectionMode: SelectionMode;
  setSelectionMode: (mode: SelectionMode) => void;

  // Selection state
  selectionState: SelectionState;
  setHoveredFace: (faceIndex: number | null) => void;
  setHoveredEdge: (edge: { start: THREE.Vector3; end: THREE.Vector3 } | null) => void;
  setHoveredPoint: (point: THREE.Vector3 | null) => void;
  setMultiSelect: (enabled: boolean) => void;

  // Helper to add face annotation from raycast hit
  addFaceFromRaycast: (
    faceIndex: number,
    geometry: THREE.BufferGeometry,
    label?: string
  ) => FaceAnnotation;

  // Helper to add edge annotation
  addEdgeFromPoints: (
    start: THREE.Vector3,
    end: THREE.Vector3,
    label?: string
  ) => EdgeAnnotation;

  // Helper to add point annotation
  addPointAnnotation: (
    position: THREE.Vector3,
    label?: string,
    vertexIndex?: number
  ) => PointAnnotation;

  // Get prompt context for AI
  getPromptContext: () => string;

  // Check if there are any annotations
  hasAnnotations: boolean;

  // Toggle annotation visibility
  toggleAnnotationVisibility: (id: string) => void;

  // Get annotation by ID
  getAnnotation: (id: string) => Annotation | undefined;
}

const AnnotationContext = createContext<AnnotationContextType | null>(null);

export function AnnotationProvider({ children }: { children: ReactNode }) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('none');
  const [selectionState, setSelectionState] = useState<SelectionState>({
    mode: 'none',
    hoveredFaceIndex: null,
    hoveredEdge: null,
    hoveredPoint: null,
    isMultiSelect: false,
  });

  const addAnnotation = useCallback(
    (annotation: Omit<Annotation, 'id' | 'createdAt' | 'visible'>): Annotation => {
      const newAnnotation: Annotation = {
        ...annotation,
        id: createAnnotationId(),
        createdAt: new Date(),
        visible: true,
      } as Annotation;

      setAnnotations((prev) => [...prev, newAnnotation]);
      return newAnnotation;
    },
    []
  );

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAnnotation = useCallback((id: string, updates: Partial<Annotation>) => {
    setAnnotations((prev): Annotation[] =>
      prev.map((a): Annotation => (a.id === id ? ({ ...a, ...updates } as Annotation) : a))
    );
  }, []);

  const clearAnnotations = useCallback(() => {
    setAnnotations([]);
  }, []);

  const setHoveredFace = useCallback((faceIndex: number | null) => {
    setSelectionState((prev) => ({ ...prev, hoveredFaceIndex: faceIndex }));
  }, []);

  const setHoveredEdge = useCallback(
    (edge: { start: THREE.Vector3; end: THREE.Vector3 } | null) => {
      setSelectionState((prev) => ({ ...prev, hoveredEdge: edge }));
    },
    []
  );

  const setHoveredPoint = useCallback((point: THREE.Vector3 | null) => {
    setSelectionState((prev) => ({ ...prev, hoveredPoint: point }));
  }, []);

  const setMultiSelect = useCallback((enabled: boolean) => {
    setSelectionState((prev) => ({ ...prev, isMultiSelect: enabled }));
  }, []);

  // Update selection state mode when selection mode changes
  const handleSetSelectionMode = useCallback((mode: SelectionMode) => {
    setSelectionMode(mode);
    setSelectionState((prev) => ({
      ...prev,
      mode,
      hoveredFaceIndex: null,
      hoveredEdge: null,
      hoveredPoint: null,
    }));
  }, []);

  const addFaceFromRaycast = useCallback(
    (
      faceIndex: number,
      geometry: THREE.BufferGeometry,
      label?: string
    ): FaceAnnotation => {
      const positionAttr = geometry.getAttribute('position');
      const indexAttr = geometry.getIndex();

      // Get the three vertices of the face
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

      const v0 = new THREE.Vector3().fromBufferAttribute(positionAttr, i0);
      const v1 = new THREE.Vector3().fromBufferAttribute(positionAttr, i1);
      const v2 = new THREE.Vector3().fromBufferAttribute(positionAttr, i2);

      // Calculate centroid
      const centroid = new THREE.Vector3()
        .add(v0)
        .add(v1)
        .add(v2)
        .divideScalar(3);

      // Calculate normal
      const edge1 = new THREE.Vector3().subVectors(v1, v0);
      const edge2 = new THREE.Vector3().subVectors(v2, v0);
      const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

      // Calculate area (using cross product magnitude / 2)
      const area = new THREE.Vector3().crossVectors(edge1, edge2).length() / 2;

      const annotationCount = annotations.filter((a) => a.type === 'face').length;
      const defaultLabel = label || `Face ${annotationCount + 1}`;

      const annotation: Omit<FaceAnnotation, 'id' | 'createdAt' | 'visible'> = {
        type: 'face',
        label: defaultLabel,
        color: ANNOTATION_COLORS.face,
        faceIndices: [faceIndex],
        centroid,
        normal,
        area,
      };

      return addAnnotation(annotation) as FaceAnnotation;
    },
    [annotations, addAnnotation]
  );

  const addEdgeFromPoints = useCallback(
    (
      start: THREE.Vector3,
      end: THREE.Vector3,
      label?: string
    ): EdgeAnnotation => {
      const direction = new THREE.Vector3().subVectors(end, start).normalize();
      const length = start.distanceTo(end);

      const annotationCount = annotations.filter((a) => a.type === 'edge').length;
      const defaultLabel = label || `Edge ${annotationCount + 1}`;

      const annotation: Omit<EdgeAnnotation, 'id' | 'createdAt' | 'visible'> = {
        type: 'edge',
        label: defaultLabel,
        color: ANNOTATION_COLORS.edge,
        startPoint: start.clone(),
        endPoint: end.clone(),
        length,
        direction,
      };

      return addAnnotation(annotation) as EdgeAnnotation;
    },
    [annotations, addAnnotation]
  );

  const addPointAnnotation = useCallback(
    (
      position: THREE.Vector3,
      label?: string,
      vertexIndex?: number
    ): PointAnnotation => {
      const annotationCount = annotations.filter((a) => a.type === 'point').length;
      const defaultLabel = label || `Point ${annotationCount + 1}`;

      const annotation: Omit<PointAnnotation, 'id' | 'createdAt' | 'visible'> = {
        type: 'point',
        label: defaultLabel,
        color: ANNOTATION_COLORS.point,
        position: position.clone(),
        vertexIndex,
      };

      return addAnnotation(annotation) as PointAnnotation;
    },
    [annotations, addAnnotation]
  );

  const getPromptContext = useCallback(() => {
    return annotationsToPromptContext(annotations.filter((a) => a.visible));
  }, [annotations]);

  const toggleAnnotationVisibility = useCallback((id: string) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, visible: !a.visible } : a))
    );
  }, []);

  const getAnnotation = useCallback(
    (id: string) => annotations.find((a) => a.id === id),
    [annotations]
  );

  const value: AnnotationContextType = {
    annotations,
    addAnnotation,
    removeAnnotation,
    updateAnnotation,
    clearAnnotations,
    selectionMode,
    setSelectionMode: handleSetSelectionMode,
    selectionState,
    setHoveredFace,
    setHoveredEdge,
    setHoveredPoint,
    setMultiSelect,
    addFaceFromRaycast,
    addEdgeFromPoints,
    addPointAnnotation,
    getPromptContext,
    hasAnnotations: annotations.length > 0,
    toggleAnnotationVisibility,
    getAnnotation,
  };

  return (
    <AnnotationContext.Provider value={value}>
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotations() {
  const context = useContext(AnnotationContext);
  if (!context) {
    // Return a safe default when used outside provider (e.g., during SSR or initial mount)
    return {
      annotations: [],
      addAnnotation: () => ({} as Annotation),
      removeAnnotation: () => {},
      updateAnnotation: () => {},
      clearAnnotations: () => {},
      selectionMode: 'none' as SelectionMode,
      setSelectionMode: () => {},
      selectionState: {
        mode: 'none' as SelectionMode,
        hoveredFaceIndex: null,
        hoveredEdge: null,
        hoveredPoint: null,
        isMultiSelect: false,
      },
      setHoveredFace: () => {},
      setHoveredEdge: () => {},
      setHoveredPoint: () => {},
      setMultiSelect: () => {},
      addFaceFromRaycast: () => ({} as FaceAnnotation),
      addEdgeFromPoints: () => ({} as EdgeAnnotation),
      addPointAnnotation: () => ({} as PointAnnotation),
      getPromptContext: () => '',
      hasAnnotations: false,
      toggleAnnotationVisibility: () => {},
      getAnnotation: () => undefined,
    };
  }
  return context;
}
