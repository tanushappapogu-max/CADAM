import { RefreshCcw, Download, ChevronUp, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ParameterInput } from '@/components/parameter/ParameterInput';
import { ColorPicker } from '@/components/parameter/ColorPicker';
import { validateParameterValue } from '@/utils/parameterUtils';
import { useCurrentMessage } from '@/contexts/CurrentMessageContext';
import {
  downloadSTLFile,
  downloadOpenSCADFile,
  downloadDXFFile,
  downloadSVGFile,
} from '@/utils/downloadUtils';
import { useChangeParameters } from '@/services/messageService';
import { useBlob } from '@/contexts/BlobContext';

type Format = 'stl' | 'scad' | 'dxf-flat' | 'dxf-cut' | 'svg-flat' | 'svg-cut';

/** Creates a temporary worker for 2D export, returns blob */
async function export2D(
  code: string,
  format: 'dxf' | 'svg',
  projection: 'flat' | 'cut',
  params: Parameter[],
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('../../worker/worker.ts', import.meta.url),
      { type: 'module' },
    );
    const id = Date.now().toString();

    worker.onmessage = (e) => {
      worker.terminate();
      if (e.data.err) {
        reject(new Error(e.data.err.message || 'Export failed'));
      } else if (e.data.data?.output) {
        resolve(
          new Blob([e.data.data.output], {
            type: format === 'dxf' ? 'application/dxf' : 'image/svg+xml',
          }),
        );
      } else {
        reject(new Error('No output'));
      }
    };
    worker.onerror = (e) => {
      worker.terminate();
      reject(e);
    };
    worker.postMessage({
      id,
      type: 'export2d',
      data: { code, format, projection, params },
    });
  });
}

export function ParameterSection() {
  const { blob } = useBlob();
  const changeParameters = useChangeParameters();
  const { currentMessage } = useCurrentMessage();
  const parameters = currentMessage?.content.artifact?.parameters ?? [];
  const [selectedFormat, setSelectedFormat] = useState<Format>('stl');
  const [isExporting, setIsExporting] = useState(false);

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
      // Store the parameters to submit
      pendingParametersRef.current = params;

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounced timer (200ms delay)
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

  const handleDownload = async () => {
    const code = currentMessage?.content.artifact?.code;
    if (!code && selectedFormat !== 'stl') return;

    if (selectedFormat === 'stl') {
      if (blob) downloadSTLFile(blob, currentMessage);
    } else if (selectedFormat === 'scad') {
      if (code) downloadOpenSCADFile(code, currentMessage);
    } else {
      // 2D formats: dxf-flat, dxf-cut, svg-flat, svg-cut
      const [fmt, proj] = selectedFormat.split('-') as [
        'dxf' | 'svg',
        'flat' | 'cut',
      ];
      setIsExporting(true);
      try {
        const output = await export2D(code!, fmt, proj, parameters);
        if (fmt === 'dxf') downloadDXFFile(output, currentMessage);
        else downloadSVGFile(output, currentMessage);
      } catch (e) {
        console.error('2D export failed:', e);
      } finally {
        setIsExporting(false);
      }
    }
  };

  const isDownloadDisabled =
    isExporting ||
    (selectedFormat === 'stl'
      ? !blob
      : !currentMessage?.content.artifact?.code);

  return (
    <div className="h-full w-full max-w-full border-l border-gray-200/20 bg-adam-bg-secondary-dark dark:border-gray-800">
      <div className="flex h-14 items-center justify-between border-b border-adam-neutral-700 bg-gradient-to-r from-adam-bg-secondary-dark to-adam-bg-secondary-dark/95 px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-adam-text-primary">
            Parameters
          </span>
        </div>
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
      </div>
      <div className="flex h-[calc(100%-3.5rem)] flex-col justify-between overflow-hidden">
        <ScrollArea className="flex-1 px-6 py-6">
          <div className="flex flex-col gap-3">
            {parameters.map((param) => (
              <ParameterInput
                key={param.name}
                param={param}
                handleCommit={handleCommit}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="flex flex-col gap-4 border-t border-adam-neutral-700 px-6 py-6">
          <div>
            <ColorPicker />
          </div>
          <div className="flex">
            <Button
              onClick={handleDownload}
              disabled={isDownloadDisabled}
              aria-label={`download ${selectedFormat.toUpperCase()} file`}
              className="h-12 flex-1 rounded-r-none bg-adam-neutral-50 text-adam-neutral-800 hover:bg-adam-neutral-100 hover:text-adam-neutral-900"
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {selectedFormat.split('-')[0].toUpperCase()}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={!blob && !currentMessage?.content.artifact?.code}
                  aria-label="select download format"
                  className="h-12 w-12 rounded-l-none border-l border-adam-neutral-300 bg-adam-neutral-50 p-0 text-adam-neutral-800 hover:bg-adam-neutral-100 hover:text-adam-neutral-900"
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
                  <span className="ml-auto text-xs text-adam-text-primary/60">
                    3D Print
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedFormat('scad')}
                  disabled={!currentMessage?.content.artifact?.code}
                  className="cursor-pointer text-adam-text-primary"
                >
                  <span className="text-sm">.SCAD</span>
                  <span className="ml-auto text-xs text-adam-text-primary/60">
                    Source
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-adam-neutral-600" />
                <DropdownMenuItem
                  onClick={() => setSelectedFormat('dxf-flat')}
                  disabled={!currentMessage?.content.artifact?.code}
                  className="cursor-pointer text-adam-text-primary"
                >
                  <span className="text-sm">.DXF</span>
                  <span className="ml-auto text-xs text-adam-text-primary/60">
                    Top view
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedFormat('dxf-cut')}
                  disabled={!currentMessage?.content.artifact?.code}
                  className="cursor-pointer text-adam-text-primary"
                >
                  <span className="text-sm">.DXF</span>
                  <span className="ml-auto text-xs text-adam-text-primary/60">
                    Cross-section
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedFormat('svg-flat')}
                  disabled={!currentMessage?.content.artifact?.code}
                  className="cursor-pointer text-adam-text-primary"
                >
                  <span className="text-sm">.SVG</span>
                  <span className="ml-auto text-xs text-adam-text-primary/60">
                    Top view
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedFormat('svg-cut')}
                  disabled={!currentMessage?.content.artifact?.code}
                  className="cursor-pointer text-adam-text-primary"
                >
                  <span className="text-sm">.SVG</span>
                  <span className="ml-auto text-xs text-adam-text-primary/60">
                    Cross-section
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
