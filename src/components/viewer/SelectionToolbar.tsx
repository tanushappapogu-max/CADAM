import { ComponentType } from 'react';
import { useAnnotations } from '@/contexts/AnnotationContext';
import { SelectionMode } from '@/types/annotations';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MousePointer2, Square, Minus, CircleDot, Trash2 } from 'lucide-react';

interface SelectionToolbarProps {
  disabled?: boolean;
}

const SELECTION_MODES: {
  mode: SelectionMode;
  icon: ComponentType<{ className?: string }>;
  label: string;
  description: string;
}[] = [
  {
    mode: 'none',
    icon: MousePointer2,
    label: 'Select',
    description: 'Navigate mode - click and drag to rotate',
  },
  {
    mode: 'face',
    icon: Square,
    label: 'Face',
    description: 'Select faces to annotate',
  },
  {
    mode: 'edge',
    icon: Minus,
    label: 'Edge',
    description: 'Select edges to annotate (coming soon)',
  },
  {
    mode: 'point',
    icon: CircleDot,
    label: 'Point',
    description: 'Select points to annotate',
  },
];

export function SelectionToolbar({ disabled = false }: SelectionToolbarProps) {
  const { selectionMode, setSelectionMode, annotations, clearAnnotations } =
    useAnnotations();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-adam-neutral-800/90 p-1 backdrop-blur-sm">
      {SELECTION_MODES.map(({ mode, icon: Icon, label, description }) => {
        const isActive = selectionMode === mode;
        const isDisabled = disabled || (mode === 'edge'); // Edge mode not implemented yet

        return (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <button
                onClick={() => !isDisabled && setSelectionMode(mode)}
                disabled={isDisabled}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200',
                  isActive
                    ? 'bg-adam-blue text-white shadow-md'
                    : 'text-adam-text-secondary hover:bg-adam-neutral-700 hover:text-adam-text-primary',
                  isDisabled && 'cursor-not-allowed opacity-40'
                )}
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px]">
              <p className="font-medium">{label}</p>
              <p className="text-xs text-adam-text-secondary">{description}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}

      {/* Divider */}
      <div className="mx-1 h-6 w-px bg-adam-neutral-600" />

      {/* Clear annotations button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={clearAnnotations}
            disabled={disabled || annotations.length === 0}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200',
              'text-adam-text-secondary hover:bg-red-500/20 hover:text-red-400',
              (disabled || annotations.length === 0) &&
                'cursor-not-allowed opacity-40'
            )}
            aria-label="Clear all annotations"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Clear all annotations ({annotations.length})</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
