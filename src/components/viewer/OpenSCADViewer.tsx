import { useOpenSCAD } from '@/hooks/useOpenSCAD';
import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { ThreeScene } from '@/components/viewer/ThreeScene';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import * as THREE from 'three';
import { BufferGeometry } from 'three';
import { Loader2, CircleAlert, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpenSCADError from '@/lib/OpenSCADError';
import { cn } from '@/lib/utils';
import { useConversation } from '@/services/conversationService';
import { useCurrentMessage } from '@/contexts/CurrentMessageContext';
import { Content } from '@shared/types';
import { useSendContentMutation } from '@/services/messageService';
import { useBlob } from '@/contexts/BlobContext';
import { useMeshFiles } from '@/contexts/MeshFilesContext';
import { useMode } from '@/contexts/ModeContext';
import { generateTriplanarUVs } from '@/utils/architectureMaterials';

// Extract import() filenames from OpenSCAD code
function extractImportFilenames(code: string): string[] {
  const importRegex = /import\s*\(\s*"([^"]+)"\s*\)/g;
  const filenames: string[] = [];
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    filenames.push(match[1]);
  }
  return filenames;
}

// Extract render_if("name") component names from OpenSCAD code
function parseComponentNames(code: string): string[] {
  const regex = /render_if\s*\(\s*"([^"]+)"\s*\)/g;
  const names = new Set<string>();
  let match;
  while ((match = regex.exec(code)) !== null) {
    if (match[1] !== 'all') names.add(match[1]);
  }
  return Array.from(names);
}

export function OpenSCADViewer() {
  const { conversation } = useConversation();
  const { currentMessage } = useCurrentMessage();
  const { setBlob } = useBlob();
  const { mode } = useMode();
  const { compileScad, compileScadAsync, writeFile, isCompiling, output, isError, error } =
    useOpenSCAD();
  const { getMeshFile, hasMeshFile } = useMeshFiles();
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const [componentGeometries, setComponentGeometries] = useState<Map<string, BufferGeometry> | null>(null);
  const [isCompilingComponents, setIsCompilingComponents] = useState(false);
  const { mutate: sendMessage } = useSendContentMutation({ conversation });
  const writtenFilesRef = useRef<Map<string, Blob>>(new Map());

  const scadCode = currentMessage?.content.artifact?.code;
  const isArchitecture = mode === 'architecture';
  const archLibLoadedRef = useRef(false);

  // Parse component names from source code
  const componentNames = useMemo(() => {
    if (!scadCode || !isArchitecture) return [];
    return parseComponentNames(scadCode);
  }, [scadCode, isArchitecture]);

  // Refs for background compilation (to avoid stale closures)
  const compilationGenRef = useRef(0);
  const compileScadAsyncRef = useRef(compileScadAsync);
  compileScadAsyncRef.current = compileScadAsync;
  const scadCodeRef = useRef(scadCode);
  scadCodeRef.current = scadCode;
  const componentNamesRef = useRef(componentNames);
  componentNamesRef.current = componentNames;

  // Main compilation: compile full model
  useEffect(() => {
    if (!scadCode) return;

    const compileWithFiles = async () => {
      try {
        // In architecture mode, pre-load the parts library if code uses it
        if (isArchitecture && !archLibLoadedRef.current && scadCode.includes('architecture_parts.scad')) {
          try {
            const response = await fetch(`${import.meta.env.BASE_URL}libraries/architecture_parts.scad`);
            const text = await response.text();
            const blob = new Blob([text], { type: 'text/plain' });
            await writeFile('architecture_parts.scad', blob);
            archLibLoadedRef.current = true;
          } catch (err) {
            console.error('[OpenSCAD] Error loading architecture parts library:', err);
          }
        }

        // Extract any import() filenames from the code
        const importedFiles = extractImportFilenames(scadCode);

        // Write any mesh files that haven't been written yet
        for (const filename of importedFiles) {
          const inContext = hasMeshFile(filename);
          const meshContent = getMeshFile(filename);

          const writtenBlob = writtenFilesRef.current.get(filename);
          const needsWrite =
            inContext &&
            meshContent &&
            (!writtenBlob || writtenBlob !== meshContent);

          if (needsWrite && meshContent) {
            await writeFile(filename, meshContent);
            writtenFilesRef.current.set(filename, meshContent);
          }
        }

        // For full model compilation, prepend _render_component = "all" if code uses render_if
        const hasRenderIf = scadCode.includes('render_if');
        const fullCode = hasRenderIf
          ? `_render_component = "all";\n${scadCode}`
          : scadCode;
        compileScad(fullCode, 'stl');
      } catch (err) {
        console.error('[OpenSCAD] Error preparing files for compilation:', err);
      }
    };

    compileWithFiles();
  }, [scadCode, compileScad, writeFile, getMeshFile, hasMeshFile, isArchitecture]);

  // Process compiled output and start background component compilations
  useEffect(() => {
    setBlob(output ?? null);
    if (output && output instanceof Blob) {
      const gen = ++compilationGenRef.current;
      setComponentGeometries(null);

      output.arrayBuffer().then(async (buffer) => {
        const loader = new STLLoader();
        const geom = loader.parse(buffer);
        geom.computeBoundingBox();
        const center = new THREE.Vector3();
        geom.boundingBox!.getCenter(center);
        geom.translate(-center.x, -center.y, -center.z);
        geom.computeVertexNormals();
        if (isArchitecture) generateTriplanarUVs(geom);
        setGeometry(geom);

        // Background: compile individual components for per-component materials
        const names = componentNamesRef.current;
        const code = scadCodeRef.current;
        if (isArchitecture && names.length > 0 && code) {
          setIsCompilingComponents(true);
          const results = new Map<string, BufferGeometry>();

          for (const name of names) {
            if (compilationGenRef.current !== gen) break;

            const modifiedCode = `_render_component = "${name}";\n${code}`;
            const blob = await compileScadAsyncRef.current(modifiedCode, 'stl');

            if (compilationGenRef.current !== gen) break;
            if (!blob) continue;

            const buf = await blob.arrayBuffer();
            const compGeom = loader.parse(buf);
            // Apply same centering offset as the full model
            compGeom.translate(-center.x, -center.y, -center.z);
            compGeom.computeVertexNormals();
            generateTriplanarUVs(compGeom);
            results.set(name, compGeom);
          }

          if (compilationGenRef.current === gen && results.size > 0) {
            setComponentGeometries(results);
          }
          if (compilationGenRef.current === gen) {
            setIsCompilingComponents(false);
          }
        }
      });
    } else {
      setGeometry(null);
      setComponentGeometries(null);
    }
  }, [output, setBlob, isArchitecture]);

  const fixError = useCallback(
    async (error: OpenSCADError) => {
      const newContent: Content = {
        text: 'Fix with AI',
        error: error.stdErr.join('\n'),
      };

      sendMessage(newContent);
    },
    [sendMessage],
  );

  const isLastMessage =
    conversation.current_message_leaf_id === currentMessage?.id;

  return (
    <div className="h-full w-full bg-adam-neutral-700/50 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out">
      <div className="h-full w-full">
        {geometry ? (
          <div className="h-full w-full">
            <ThreeScene geometry={geometry} componentGeometries={componentGeometries} />
          </div>
        ) : (
          <>
            {isError && (
              <div className="flex h-full items-center justify-center">
                <FixWithAIButton
                  error={error}
                  fixError={isLastMessage ? fixError : undefined}
                  isArchitecture={mode === 'architecture'}
                />
              </div>
            )}
          </>
        )}
        {(isCompiling || isCompilingComponents) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-adam-neutral-700/30 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className={`h-6 w-6 animate-spin ${mode === 'architecture' ? 'text-[#C77DFF]' : 'text-adam-blue'}`} />
              <p className="text-xs font-medium text-adam-text-primary/70">
                {isCompilingComponents ? 'Loading materials...' : 'Compiling...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FixWithAIButton({
  error,
  fixError,
  isArchitecture,
}: {
  error?: OpenSCADError | Error;
  fixError?: (error: OpenSCADError) => void;
  isArchitecture?: boolean;
}) {
  const accentClass = isArchitecture ? 'text-[#C77DFF]' : 'text-adam-blue';
  const pingClass = isArchitecture ? 'bg-[#C77DFF]/20' : 'bg-adam-blue/20';

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className={`absolute inset-0 animate-ping rounded-full ${pingClass}`} />
          <CircleAlert className={`h-8 w-8 ${accentClass}`} />
        </div>
        <div className="text-center">
          <p className={`text-sm font-medium ${accentClass}`}>
            Error Compiling Model
          </p>
          <p className="mt-1 text-xs text-adam-text-primary/60">
            {isArchitecture ? 'Parametrix' : 'Adam'} encountered an error while compiling
          </p>
        </div>
      </div>
      {fixError && error && error.name === 'OpenSCADError' && (
        <Button
          variant="ghost"
          className={cn(
            'group relative flex items-center gap-2 rounded-lg border',
            isArchitecture
              ? 'bg-gradient-to-br from-[#C77DFF]/20 to-adam-neutral-800/70 p-3'
              : 'bg-gradient-to-br from-adam-blue/20 to-adam-neutral-800/70 p-3',
            isArchitecture
              ? 'border-[#C77DFF]/30 text-adam-text-primary'
              : 'border-adam-blue/30 text-adam-text-primary',
            'transition-all duration-300 ease-in-out',
            isArchitecture
              ? 'hover:border-[#C77DFF]/70 hover:bg-[#C77DFF]/50 hover:text-white'
              : 'hover:border-adam-blue/70 hover:bg-adam-blue/50 hover:text-white',
            isArchitecture
              ? 'hover:shadow-[0_0_25px_rgba(199,125,255,0.4)]'
              : 'hover:shadow-[0_0_25px_rgba(0,166,255,0.4)]',
            isArchitecture
              ? 'focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30'
              : 'focus:outline-none focus:ring-2 focus:ring-adam-blue/30',
          )}
          onClick={() => {
            if (error && error.name === 'OpenSCADError') {
              fixError?.(error as OpenSCADError);
            }
          }}
        >
          <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${isArchitecture ? 'from-[#C77DFF]/20' : 'from-adam-blue/20'} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
          <Wrench className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          <span className="relative text-sm font-medium">Fix with AI</span>
        </Button>
      )}
    </div>
  );
}
