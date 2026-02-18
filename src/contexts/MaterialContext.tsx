import { createContext, useContext } from 'react';

export type ViewMode = 'realistic' | 'wireframe' | 'xray';

// Maps a component/zone name to a surface material key (user overrides)
export type ZoneMaterialOverrides = Record<string, string>;

// A detected building component (from AI tagging or heuristic analysis)
export interface DetectedZone {
  zone: string;
  label: string;
  materialKey: string;
  faceCount: number;
}

type MaterialContextType = {
  isRealView: boolean;
  setIsRealView: (isRealView: boolean) => void;
  surfaceMaterial: string;
  setSurfaceMaterial: (material: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  zoneMaterials: ZoneMaterialOverrides;
  setZoneMaterial: (zone: string, materialKey: string) => void;
  clearZoneMaterials: () => void;
  detectedZones: DetectedZone[];
  setDetectedZones: (zones: DetectedZone[]) => void;
};

export const MaterialContext = createContext<MaterialContextType>({
  isRealView: false,
  setIsRealView: () => {},
  surfaceMaterial: 'concrete',
  setSurfaceMaterial: () => {},
  viewMode: 'realistic',
  setViewMode: () => {},
  zoneMaterials: {},
  setZoneMaterial: () => {},
  clearZoneMaterials: () => {},
  detectedZones: [],
  setDetectedZones: () => {},
});

export const useMaterial = () => {
  const context = useContext(MaterialContext);
  if (!context) {
    throw new Error('useMaterial must be used within a MaterialProvider');
  }
  return context;
};
