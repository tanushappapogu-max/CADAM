import * as THREE from 'three';

// Selection mode types
export type SelectionMode = 'none' | 'face' | 'edge' | 'point';

// Annotation types
export type AnnotationType = 'face' | 'edge' | 'point' | 'dimension' | 'label';

// Base annotation interface
export interface BaseAnnotation {
  id: string;
  type: AnnotationType;
  label: string;
  description?: string;
  color?: string;
  visible: boolean;
  createdAt: Date;
  // Optional parameter association
  parameterId?: string;
  parameterName?: string;
}

// Face selection annotation
export interface FaceAnnotation extends BaseAnnotation {
  type: 'face';
  // Face indices from the geometry
  faceIndices: number[];
  // Center point of the selected face(s)
  centroid: THREE.Vector3;
  // Normal vector of the face
  normal: THREE.Vector3;
  // Area of the face (approximate)
  area?: number;
}

// Edge selection annotation
export interface EdgeAnnotation extends BaseAnnotation {
  type: 'edge';
  // Start and end points of the edge
  startPoint: THREE.Vector3;
  endPoint: THREE.Vector3;
  // Length of the edge
  length: number;
  // Direction vector
  direction: THREE.Vector3;
}

// Point selection annotation
export interface PointAnnotation extends BaseAnnotation {
  type: 'point';
  // Position of the point
  position: THREE.Vector3;
  // Vertex index if applicable
  vertexIndex?: number;
}

// Dimension annotation (for measuring)
export interface DimensionAnnotation extends BaseAnnotation {
  type: 'dimension';
  // Start and end points for the dimension
  startPoint: THREE.Vector3;
  endPoint: THREE.Vector3;
  // Measured value
  value: number;
  // Unit of measurement
  unit: 'mm' | 'cm' | 'in';
}

// Label annotation (for text labels)
export interface LabelAnnotation extends BaseAnnotation {
  type: 'label';
  // Position of the label
  position: THREE.Vector3;
  // Text content
  text: string;
  // Font size
  fontSize?: number;
}

// Union type for all annotations
export type Annotation =
  | FaceAnnotation
  | EdgeAnnotation
  | PointAnnotation
  | DimensionAnnotation
  | LabelAnnotation;

// Selection state for tracking current selection
export interface SelectionState {
  mode: SelectionMode;
  hoveredFaceIndex: number | null;
  hoveredEdge: { start: THREE.Vector3; end: THREE.Vector3 } | null;
  hoveredPoint: THREE.Vector3 | null;
  // For multi-select (shift+click)
  isMultiSelect: boolean;
}

// Context for annotation text generation for AI
export interface AnnotationContext {
  annotations: Annotation[];
  // Serialized for AI consumption
  toPromptContext(): string;
}

// Helper to serialize annotations for AI prompt
export function annotationsToPromptContext(annotations: Annotation[]): string {
  if (annotations.length === 0) {
    return '';
  }

  const lines: string[] = ['[User has selected the following parts of the 3D model:]'];

  annotations.forEach((annotation, index) => {
    const num = index + 1;
    switch (annotation.type) {
      case 'face':
        lines.push(`${num}. Face "${annotation.label}": Normal direction (${formatVector(annotation.normal)}), Center at (${formatVector(annotation.centroid)})${annotation.area ? `, Area: ~${annotation.area.toFixed(1)}mm²` : ''}${annotation.description ? ` - ${annotation.description}` : ''}`);
        break;
      case 'edge':
        lines.push(`${num}. Edge "${annotation.label}": From (${formatVector(annotation.startPoint)}) to (${formatVector(annotation.endPoint)}), Length: ${annotation.length.toFixed(2)}mm${annotation.description ? ` - ${annotation.description}` : ''}`);
        break;
      case 'point':
        lines.push(`${num}. Point "${annotation.label}": Position (${formatVector(annotation.position)})${annotation.description ? ` - ${annotation.description}` : ''}`);
        break;
      case 'dimension':
        lines.push(`${num}. Dimension "${annotation.label}": ${annotation.value.toFixed(2)}${annotation.unit}${annotation.description ? ` - ${annotation.description}` : ''}`);
        break;
      case 'label':
        lines.push(`${num}. Label "${annotation.label}": "${annotation.text}" at (${formatVector(annotation.position)})${annotation.description ? ` - ${annotation.description}` : ''}`);
        break;
    }

    // Add parameter association if present
    if (annotation.parameterName) {
      lines[lines.length - 1] += ` [Associated with parameter: ${annotation.parameterName}]`;
    }
  });

  return lines.join('\n');
}

// Helper to format Vector3 for display
function formatVector(vec: THREE.Vector3): string {
  return `${vec.x.toFixed(1)}, ${vec.y.toFixed(1)}, ${vec.z.toFixed(1)}`;
}

// Helper to create a unique ID
export function createAnnotationId(): string {
  return `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Default colors for different annotation types
export const ANNOTATION_COLORS = {
  face: '#ff6b6b',      // Red for faces
  edge: '#4ecdc4',      // Teal for edges
  point: '#ffe66d',     // Yellow for points
  dimension: '#95e1d3', // Mint for dimensions
  label: '#dfe6e9',     // Light gray for labels
  hover: '#00A6FF',     // Blue for hover state
  selected: '#ff9f43',  // Orange for selected state
} as const;
