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
import { useEffect, useMemo, useState } from 'react';
import { OrthographicPerspectiveToggle } from '@/components/viewer/OrthographicPerspectiveToggle';
import { useColor } from '@/contexts/ColorContext';
import { useMode } from '@/contexts/ModeContext';
import { useMaterial, type ViewMode } from '@/contexts/MaterialContext';
import { Switch } from '@/components/ui/switch';
import { Eye, Box, Grid3x3, Scan } from 'lucide-react';
import {
  splitGeometryByComponents,
  extractFaces,
  createSurfaceMaterial,
  getDefaultMaterialForComponent,
  getComponentLabel,
  SURFACE_MATERIALS,
  ZONE_LABELS,
  type NormalGroup,
} from '@/utils/architectureMaterials';
import type { DetectedZone } from '@/contexts/MaterialContext';

function GroundPlane({ yPosition }: { yPosition: number }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, yPosition, 0]}
      receiveShadow
    >
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial color="#4a7c2e" roughness={0.9} metalness={0} />
    </mesh>
  );
}

/**
 * Creates a Three.js material for a given surface material key and view mode.
 */
function createMaterialForViewMode(matKey: string, viewMode: ViewMode): THREE.Material {
  const matDef = SURFACE_MATERIALS[matKey] ?? SURFACE_MATERIALS.concrete;

  if (viewMode === 'wireframe') {
    return new THREE.MeshBasicMaterial({
      color: matDef.color,
      wireframe: true,
    });
  }
  if (viewMode === 'xray') {
    return new THREE.MeshPhysicalMaterial({
      color: matDef.color,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }
  return createSurfaceMaterial(matDef);
}

/**
 * Renders AI-tagged components, each with its own material.
 */
function ComponentMaterialModel({
  componentGeometries,
  viewMode,
  componentMaterials,
}: {
  componentGeometries: Map<string, THREE.BufferGeometry>;
  viewMode: ViewMode;
  componentMaterials: Record<string, string>;
}) {
  const meshes = useMemo(() => {
    return Array.from(componentGeometries.entries()).map(([name, geo]) => {
      const matKey = componentMaterials[name] || getDefaultMaterialForComponent(name);
      const matDef = SURFACE_MATERIALS[matKey] ?? SURFACE_MATERIALS.concrete;
      const material = createMaterialForViewMode(matKey, viewMode);
      const isTransparent = (matDef.transparent ?? false) || viewMode === 'xray';

      return { geo, material, key: name, transparent: isTransparent };
    });
  }, [componentGeometries, viewMode, componentMaterials]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {meshes.map(({ geo, material, key, transparent }) => (
        <mesh
          key={key}
          geometry={geo}
          material={material}
          castShadow={!transparent && viewMode === 'realistic'}
          receiveShadow={!transparent && viewMode === 'realistic'}
        />
      ))}
    </group>
  );
}

/**
 * Renders the geometry split into heuristic zones (roof, walls, floor),
 * each with its own material from the zone overrides.
 * Used as fallback when AI component tagging is not available.
 */
function ZoneMaterialModel({
  geometry,
  normalGroups,
  viewMode,
  zoneMaterials,
}: {
  geometry: THREE.BufferGeometry;
  normalGroups: NormalGroup[];
  viewMode: ViewMode;
  zoneMaterials: Record<string, string>;
}) {
  const meshes = useMemo(() => {
    return normalGroups.map((group) => {
      const geo = extractFaces(geometry, group.indices);
      const matKey = zoneMaterials[group.zone] ?? group.defaultMaterial;
      const matDef = SURFACE_MATERIALS[matKey] ?? SURFACE_MATERIALS.concrete;
      const material = createMaterialForViewMode(matKey, viewMode);
      const isTransparent = matDef.transparent ?? false;

      return {
        geo,
        material,
        key: group.zone,
        transparent: isTransparent || viewMode === 'xray',
      };
    });
  }, [geometry, normalGroups, viewMode, zoneMaterials]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {meshes.map(({ geo, material, key, transparent }) => (
        <mesh
          key={key}
          geometry={geo}
          material={material}
          castShadow={!transparent && viewMode === 'realistic'}
          receiveShadow={!transparent && viewMode === 'realistic'}
        />
      ))}
    </group>
  );
}

function SimpleMesh({
  geometry,
  color,
  isArchitecture,
  viewMode,
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  isArchitecture: boolean;
  viewMode: ViewMode;
}) {
  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      castShadow={isArchitecture && viewMode === 'realistic'}
    >
      {viewMode === 'wireframe' ? (
        <meshBasicMaterial
          color={color}
          wireframe
        />
      ) : viewMode === 'xray' ? (
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      ) : isArchitecture ? (
        <meshStandardMaterial
          color={color}
          metalness={0.05}
          roughness={0.8}
          envMapIntensity={0.4}
        />
      ) : (
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={0.3}
        />
      )}
    </mesh>
  );
}

function RealWorldMesh({
  geometry,
  surfaceMaterialKey,
  viewMode,
}: {
  geometry: THREE.BufferGeometry;
  surfaceMaterialKey: string;
  viewMode: ViewMode;
}) {
  const material = useMemo(() => {
    return createMaterialForViewMode(surfaceMaterialKey, viewMode);
  }, [surfaceMaterialKey, viewMode]);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      material={material}
      castShadow={viewMode === 'realistic'}
      receiveShadow={viewMode === 'realistic'}
    />
  );
}

const VIEW_MODE_CONFIG: { mode: ViewMode; label: string; icon: typeof Box }[] = [
  { mode: 'realistic', label: 'Realistic', icon: Box },
  { mode: 'wireframe', label: 'Wireframe', icon: Grid3x3 },
  { mode: 'xray', label: 'X-Ray', icon: Scan },
];

interface ThreeSceneProps {
  geometry: THREE.BufferGeometry;
  componentGeometries?: Map<string, THREE.BufferGeometry> | null;
}

export function ThreeScene({ geometry, componentGeometries }: ThreeSceneProps) {
  const { color } = useColor();
  const { mode } = useMode();
  const { isRealView, setIsRealView, surfaceMaterial, viewMode, setViewMode, zoneMaterials, setDetectedZones } = useMaterial();
  const [isOrthographic, setIsOrthographic] = useState(true);

  const isArchitecture = mode === 'architecture';
  const hasComponentGeos = componentGeometries != null && componentGeometries.size > 0;

  // Heuristic splitting as fallback (only when no AI-tagged components)
  const normalGroups = useMemo(() => {
    if (hasComponentGeos || !isArchitecture || !isRealView) return null;
    return splitGeometryByComponents(geometry);
  }, [geometry, isArchitecture, isRealView, hasComponentGeos]);

  // Populate detected zones/components for the Materials tab
  useEffect(() => {
    if (hasComponentGeos) {
      // AI-tagged components: use actual component names
      const zones: DetectedZone[] = Array.from(componentGeometries!.entries()).map(([name, geo]) => ({
        zone: name,
        label: getComponentLabel(name),
        materialKey: zoneMaterials[name] || getDefaultMaterialForComponent(name),
        faceCount: geo.attributes.position.count / 3,
      }));
      setDetectedZones(zones);
    } else if (normalGroups && normalGroups.length > 0) {
      // Heuristic zones: use zone labels
      const zones: DetectedZone[] = normalGroups.map((group) => ({
        zone: group.zone,
        label: ZONE_LABELS[group.zone],
        materialKey: zoneMaterials[group.zone] ?? group.defaultMaterial,
        faceCount: group.indices.length,
      }));
      setDetectedZones(zones);
    } else {
      setDetectedZones([]);
    }
  }, [hasComponentGeos, componentGeometries, normalGroups, zoneMaterials, setDetectedZones]);

  const groundY = useMemo(() => {
    geometry.computeBoundingBox();
    return geometry.boundingBox?.min.y ?? 0;
  }, [geometry]);

  const useHeuristicZones = !hasComponentGeos && isArchitecture && isRealView && normalGroups && normalGroups.length > 0;
  const useArchLighting = isArchitecture && isRealView;
  const isWireframe = viewMode === 'wireframe';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        className="block h-full w-full"
        shadows={useArchLighting && viewMode === 'realistic'}
        gl={{
          toneMapping: useArchLighting && viewMode === 'realistic' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping,
          toneMappingExposure: useArchLighting ? 1.2 : 1.0,
        }}
      >
        {/* Background: sky blue for real view, dark for engineering */}
        <color attach="background" args={[
          isWireframe ? '#1a1a2e'
          : useArchLighting ? '#87CEEB'
          : '#3B3B3B'
        ]} />
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
            position={[-60, 50, 60]}
            fov={45}
            near={0.1}
            far={1000}
            zoom={1}
          />
        )}
        <Stage environment={null} intensity={0.6} position={[0, 0, 0]}>
          <Environment
            files={`${import.meta.env.BASE_URL}city.hdr`}
            background={false}
          />
          {isWireframe ? (
            <>
              <ambientLight intensity={1.0} />
            </>
          ) : viewMode === 'xray' ? (
            <>
              <ambientLight intensity={0.9} />
              <directionalLight position={[5, 5, 5]} intensity={0.6} />
              <directionalLight position={[-5, 5, -5]} intensity={0.3} />
            </>
          ) : useArchLighting ? (
            <>
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[8, 12, 6]}
                intensity={1.8}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-6, 8, -4]} intensity={0.4} />
              <directionalLight position={[0, 6, -8]} intensity={0.3} />
              <directionalLight position={[-3, -2, -3]} intensity={0.15} />
            </>
          ) : (
            <>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} />
              <directionalLight position={[-5, 5, 5]} intensity={0.2} />
              <directionalLight position={[-5, 5, -5]} intensity={0.2} />
              <directionalLight position={[0, 5, 0]} intensity={0.2} />
              <directionalLight position={[-5, -5, -5]} intensity={0.6} />
            </>
          )}

          {/* Rendering priority: AI components > heuristic zones > single material > simple */}
          {hasComponentGeos && useArchLighting ? (
            <ComponentMaterialModel
              componentGeometries={componentGeometries!}
              viewMode={viewMode}
              componentMaterials={zoneMaterials}
            />
          ) : useHeuristicZones ? (
            <ZoneMaterialModel
              geometry={geometry}
              normalGroups={normalGroups}
              viewMode={viewMode}
              zoneMaterials={zoneMaterials}
            />
          ) : useArchLighting ? (
            <RealWorldMesh geometry={geometry} surfaceMaterialKey={surfaceMaterial} viewMode={viewMode} />
          ) : (
            <SimpleMesh
              geometry={geometry}
              color={color}
              isArchitecture={isArchitecture}
              viewMode={isArchitecture ? viewMode : 'realistic'}
            />
          )}

          {useArchLighting && viewMode === 'realistic' && <GroundPlane yPosition={groundY} />}
        </Stage>
        <OrbitControls makeDefault enableDamping={true} dampingFactor={0.05} />
        <GizmoHelper alignment="bottom-right" margin={[80, 90]}>
          <GizmoViewcube />
        </GizmoHelper>
      </Canvas>

      {/* Viewer toolbar */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-adam-neutral-800/90 p-1 shadow-lg backdrop-blur-md">
        {/* View mode selector - architecture only */}
        {isArchitecture && (
          <>
            <div className="flex items-center gap-0.5 rounded-lg bg-adam-neutral-900/50 p-0.5">
              {VIEW_MODE_CONFIG.map(({ mode: vm, label, icon: Icon }) => (
                <button
                  key={vm}
                  onClick={() => setViewMode(vm)}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                    viewMode === vm
                      ? 'bg-[#C77DFF]/20 text-[#C77DFF] shadow-sm'
                      : 'text-adam-text-primary/60 hover:text-adam-text-primary'
                  }`}
                  title={label}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="mx-1 h-5 w-px bg-adam-text-primary/10" />
          </>
        )}

        {/* Real World toggle - architecture only */}
        {isArchitecture && (
          <>
            <div className="flex items-center gap-1.5 px-2">
              <Eye className="h-3.5 w-3.5 text-adam-text-primary/70" />
              <span className="text-[11px] text-adam-text-primary/70">Real</span>
              <Switch
                checked={isRealView}
                onCheckedChange={setIsRealView}
                className="scale-75"
              />
            </div>

            <div className="mx-1 h-5 w-px bg-adam-text-primary/10" />
          </>
        )}

        {/* Orthographic/Perspective toggle */}
        <OrthographicPerspectiveToggle
          isOrthographic={isOrthographic}
          onToggle={setIsOrthographic}
        />
      </div>
    </div>
  );
}
