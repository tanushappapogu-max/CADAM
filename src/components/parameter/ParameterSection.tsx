import { RefreshCcw, Download, ChevronUp, Paintbrush, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Parameter } from '@shared/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ParameterInput } from '@/components/parameter/ParameterInput';
import { ColorPicker } from '@/components/parameter/ColorPicker';
import { validateParameterValue } from '@/utils/parameterUtils';
import { useCurrentMessage } from '@/contexts/CurrentMessageContext';
import { downloadSTLFile, downloadOpenSCADFile } from '@/utils/downloadUtils';
import { useChangeParameters } from '@/services/messageService';
import { useBlob } from '@/contexts/BlobContext';
import { useMode } from '@/contexts/ModeContext';
import { useMaterial } from '@/contexts/MaterialContext';
import { SURFACE_MATERIALS, getDefaultMaterialForComponent, getComponentIcon } from '@/utils/architectureMaterials';

function calculateSquareFootage(parameters: Parameter[]): number | null {
  const widthParam = parameters.find((p) => {
    const name = p.name.toLowerCase();
    return (name.includes('width') || name.includes('house_width') || name.includes('building_width')) && (p.type === 'number' || !p.type);
  });
  const lengthParam = parameters.find((p) => {
    const name = p.name.toLowerCase();
    return (name.includes('length') || name.includes('depth') || name.includes('house_length') || name.includes('house_depth') || name.includes('building_length') || name.includes('building_depth')) && (p.type === 'number' || !p.type);
  });

  if (!widthParam || !lengthParam) return null;

  const width = Number(widthParam.value);
  const length = Number(lengthParam.value);

  if (isNaN(width) || isNaN(length) || width <= 0 || length <= 0) return null;

  return width * length;
}

function calculateStories(parameters: Parameter[]): number | null {
  const storiesParam = parameters.find((p) => {
    const name = p.name.toLowerCase();
    return (name.includes('stories') || name.includes('floors') || name.includes('num_floors') || name.includes('num_stories')) && (p.type === 'number' || !p.type);
  });

  if (!storiesParam) return null;
  const val = Number(storiesParam.value);
  return isNaN(val) || val <= 0 ? null : val;
}

function MaterialsTab() {
  const { detectedZones, zoneMaterials, setZoneMaterial, clearZoneMaterials } = useMaterial();

  const materialCategories = useMemo(() => {
    const cats: Record<string, { key: string; name: string }[]> = {};
    for (const [key, mat] of Object.entries(SURFACE_MATERIALS)) {
      if (!cats[mat.category]) cats[mat.category] = [];
      cats[mat.category].push({ key, name: mat.name });
    }
    return cats;
  }, []);

  if (detectedZones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <Paintbrush className="h-8 w-8 text-adam-text-primary/20" />
        <div>
          <p className="text-sm font-medium text-adam-text-primary/50">No Components Detected</p>
          <p className="mt-1 text-xs text-adam-text-primary/30">
            Toggle Real View to see material zones for your model
          </p>
        </div>
      </div>
    );
  }

  const hasOverrides = Object.keys(zoneMaterials).length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-adam-text-primary/40">
          {detectedZones.length} components
        </span>
        {hasOverrides && (
          <button
            onClick={clearZoneMaterials}
            className="text-[11px] text-[#C77DFF]/70 transition-colors hover:text-[#C77DFF]"
          >
            Reset all
          </button>
        )}
      </div>
      {detectedZones.map((zone) => {
        const currentMatKey = zoneMaterials[zone.zone] || getDefaultMaterialForComponent(zone.zone);
        const currentMat = currentMatKey ? SURFACE_MATERIALS[currentMatKey] : null;
        const swatchColor = currentMat
          ? `#${currentMat.color.toString(16).padStart(6, '0')}`
          : '#808080';

        return (
          <div
            key={zone.zone}
            className="flex items-center gap-3 rounded-lg border border-adam-neutral-700/50 bg-adam-neutral-800/40 px-3 py-2.5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-lg"
              style={{ backgroundColor: swatchColor + '30', color: swatchColor }}
            >
              {getComponentIcon(zone.zone)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-adam-text-primary">
                {zone.label}
              </p>
              <p className="truncate text-[10px] text-[#C77DFF]/70">
                {currentMat?.name ?? 'Default'} &middot; {zone.faceCount.toLocaleString()} faces
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="shrink-0 rounded-md bg-adam-neutral-700/50 px-2 py-1 text-[11px] text-adam-text-primary/70 transition-colors hover:bg-adam-neutral-600/50 hover:text-adam-text-primary">
                  Change
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="max-h-56 w-44 overflow-y-auto rounded-lg bg-adam-neutral-700 p-1"
                align="end"
                side="left"
                sideOffset={4}
              >
                {Object.entries(materialCategories).map(([category, mats]) => (
                  <div key={category}>
                    <div className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-adam-text-secondary">
                      {category}
                    </div>
                    {mats.map((mat) => (
                      <DropdownMenuItem
                        key={mat.key}
                        className={`cursor-pointer rounded-md px-3 py-1.5 text-xs transition-colors focus:bg-adam-bg-secondary-dark ${
                          currentMatKey === mat.key ? 'bg-[#C77DFF]/15 text-[#C77DFF]' : 'text-adam-text-primary'
                        }`}
                        onClick={() => setZoneMaterial(zone.zone, mat.key)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 rounded-sm border border-white/10"
                            style={{
                              backgroundColor: `#${SURFACE_MATERIALS[mat.key].color.toString(16).padStart(6, '0')}`,
                            }}
                          />
                          {mat.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
}

export function ParameterSection() {
  const { blob } = useBlob();
  const { mode } = useMode();
  const isArch = mode === 'architecture';
  const { detectedZones, isRealView } = useMaterial();
  const changeParameters = useChangeParameters();
  const { currentMessage } = useCurrentMessage();
  const parameters = currentMessage?.content.artifact?.parameters ?? [];
  const [selectedFormat, setSelectedFormat] = useState<'stl' | 'scad'>('stl');
  const [activeTab, setActiveTab] = useState<'parameters' | 'materials'>('parameters');

  const showMaterialsTab = isArch && isRealView && detectedZones.length > 0;

  // Debounce timer for compilation
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingParametersRef = useRef<Parameter[] | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Debounced submit function
  const debouncedSubmit = useCallback(
    (params: Parameter[]) => {
      pendingParametersRef.current = params;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        if (pendingParametersRef.current) {
          changeParameters(currentMessage, pendingParametersRef.current);
          pendingParametersRef.current = null;
        }
      }, 200);
    },
    [changeParameters, currentMessage],
  );

  const handleCommit = (param: Parameter, value: Parameter['value']) => {
    const validatedValue = validateParameterValue(param, value);
    const updatedParam = { ...param, value: validatedValue };
    const updatedParameters = parameters.map((p) =>
      p.name === param.name ? updatedParam : p,
    );
    debouncedSubmit(updatedParameters);
  };

  const handleDownload = () => {
    if (selectedFormat === 'stl') {
      handleDownloadSTL();
    } else {
      handleDownloadOpenSCAD();
    }
  };

  const handleDownloadSTL = () => {
    if (!blob) return;
    downloadSTLFile(blob, currentMessage);
  };

  const handleDownloadOpenSCAD = () => {
    if (!currentMessage?.content.artifact?.code) return;
    downloadOpenSCADFile(currentMessage.content.artifact.code, currentMessage);
  };

  const isDownloadDisabled =
    selectedFormat === 'stl' ? !blob : !currentMessage?.content.artifact?.code;

  return (
    <div className="h-full w-full max-w-full border-l border-gray-200/20 bg-adam-bg-secondary-dark dark:border-gray-800">
      {/* Header with tabs */}
      <div className="flex h-14 items-center justify-between border-b border-adam-neutral-700 bg-gradient-to-r from-adam-bg-secondary-dark to-adam-bg-secondary-dark/95 px-4 py-6">
        {showMaterialsTab ? (
          <div className="flex items-center gap-1 rounded-lg bg-adam-neutral-900/50 p-0.5">
            <button
              onClick={() => setActiveTab('parameters')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'parameters'
                  ? 'bg-[#C77DFF]/20 text-[#C77DFF] shadow-sm'
                  : 'text-adam-text-primary/60 hover:text-adam-text-primary'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Parameters
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'materials'
                  ? 'bg-[#C77DFF]/20 text-[#C77DFF] shadow-sm'
                  : 'text-adam-text-primary/60 hover:text-adam-text-primary'
              }`}
            >
              <Paintbrush className="h-3.5 w-3.5" />
              Materials
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight text-adam-text-primary">
              Parameters
            </span>
          </div>
        )}
        {activeTab === 'parameters' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 rounded-full p-0 text-adam-text-primary transition-colors [@media(hover:hover)]:hover:bg-adam-neutral-950 [@media(hover:hover)]:hover:text-adam-neutral-10"
                  disabled={parameters.length === 0}
                  onClick={() => {
                    const newParameters = parameters.map((param) => ({
                      ...param,
                      value: param.defaultValue,
                    }));
                    changeParameters(currentMessage, newParameters);
                  }}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset all parameters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="flex h-[calc(100%-3.5rem)] flex-col justify-between overflow-hidden">
        {/* Tab content */}
        <ScrollArea className="flex-1 px-6 py-6">
          {activeTab === 'parameters' ? (
            <div className="flex flex-col gap-3">
              {parameters.map((param) => (
                <ParameterInput
                  key={param.name}
                  param={param}
                  handleCommit={handleCommit}
                />
              ))}
            </div>
          ) : (
            <MaterialsTab />
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t border-adam-neutral-700 px-6 py-4">
          {isArch && parameters.length > 0 && (() => {
            const sqft = calculateSquareFootage(parameters);
            const stories = calculateStories(parameters);
            if (!sqft) return null;
            const totalSqft = stories ? sqft * stories : sqft;
            return (
              <div className="flex flex-col gap-1.5 rounded-lg bg-[#C77DFF]/10 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-adam-neutral-300">Footprint</span>
                  <span className="text-sm font-semibold text-[#C77DFF]">
                    {sqft.toLocaleString(undefined, { maximumFractionDigits: 0 })} ft²
                  </span>
                </div>
                {stories && stories > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-adam-neutral-300">Total ({stories} floors)</span>
                    <span className="text-sm font-semibold text-[#C77DFF]">
                      {totalSqft.toLocaleString(undefined, { maximumFractionDigits: 0 })} ft²
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
          {activeTab === 'parameters' && (
            <div>
              <ColorPicker />
            </div>
          )}
          <div className="flex">
            <Button
              onClick={handleDownload}
              disabled={isDownloadDisabled}
              aria-label={`download ${selectedFormat.toUpperCase()} file`}
              className="h-12 flex-1 rounded-r-none bg-adam-neutral-50 text-adam-neutral-800 hover:bg-adam-neutral-100 hover:text-adam-neutral-900"
            >
              <Download className="mr-2 h-4 w-4" />
              {selectedFormat.toUpperCase()}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={!blob && !currentMessage?.content.artifact?.code}
                  aria-label="select download format"
                  className="h-12 w-12 rounded-l-none border-l border-adam-neutral-300 bg-adam-neutral-50 text-adam-neutral-800 hover:bg-adam-neutral-100 hover:text-adam-neutral-900 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 border-none bg-adam-neutral-800 shadow-md"
              >
                <DropdownMenuItem
                  onClick={() => setSelectedFormat('stl')}
                  disabled={!blob}
                  className="cursor-pointer text-adam-text-primary"
                >
                  <span className="text-sm">.STL</span>
                  <span className="ml-3 text-xs text-adam-text-primary/60">
                    3D Printing
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedFormat('scad')}
                  disabled={!currentMessage?.content.artifact?.code}
                  className="cursor-pointer text-adam-text-primary"
                >
                  <span className="text-sm">.SCAD</span>
                  <span className="ml-3 text-xs text-adam-text-primary/60">
                    OpenSCAD Code
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
