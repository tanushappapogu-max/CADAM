import { useState } from 'react';
import { useAnnotations } from '@/contexts/AnnotationContext';
import { Annotation, ANNOTATION_COLORS } from '@/types/annotations';
import { cn } from '@/lib/utils';
import {
  Eye,
  EyeOff,
  Trash2,
  Square,
  Minus,
  CircleDot,
  Tag,
  ChevronDown,
  ChevronUp,
  Link2,
  MessageSquare,
} from 'lucide-react';
import { Parameter } from '@shared/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AnnotationPanelProps {
  parameters?: Parameter[];
  className?: string;
}

const TYPE_ICONS = {
  face: Square,
  edge: Minus,
  point: CircleDot,
  dimension: Tag,
  label: MessageSquare,
};

const TYPE_LABELS = {
  face: 'Face',
  edge: 'Edge',
  point: 'Point',
  dimension: 'Dimension',
  label: 'Label',
};

function AnnotationItem({
  annotation,
  parameters,
  onUpdate,
  onRemove,
  onToggleVisibility,
}: {
  annotation: Annotation;
  parameters?: Parameter[];
  onUpdate: (id: string, updates: Partial<Annotation>) => void;
  onRemove: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(annotation.label);
  const [descriptionValue, setDescriptionValue] = useState(
    annotation.description || ''
  );

  const Icon = TYPE_ICONS[annotation.type];

  const handleLabelSave = () => {
    if (labelValue.trim()) {
      onUpdate(annotation.id, { label: labelValue.trim() });
    }
    setEditingLabel(false);
  };

  const handleDescriptionSave = () => {
    onUpdate(annotation.id, { description: descriptionValue.trim() || undefined });
  };

  const handleParameterLink = (parameterName: string) => {
    if (parameterName === '__none__') {
      onUpdate(annotation.id, { parameterName: undefined, parameterId: undefined });
    } else {
      const param = parameters?.find((p) => p.name === parameterName);
      if (param) {
        onUpdate(annotation.id, {
          parameterName: param.name,
          parameterId: param.name,
        });
      }
    }
  };

  // Get info string based on annotation type
  const getInfoString = () => {
    switch (annotation.type) {
      case 'face':
        return annotation.area
          ? `Area: ~${annotation.area.toFixed(1)}mm²`
          : 'Face selected';
      case 'edge':
        return `Length: ${annotation.length.toFixed(2)}mm`;
      case 'point':
        return `(${annotation.position.x.toFixed(1)}, ${annotation.position.y.toFixed(1)}, ${annotation.position.z.toFixed(1)})`;
      case 'dimension':
        return `${annotation.value.toFixed(2)}${annotation.unit}`;
      case 'label':
        return annotation.text;
      default:
        return '';
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div
        className={cn(
          'rounded-lg border transition-all duration-200',
          annotation.visible
            ? 'border-adam-neutral-600 bg-adam-neutral-800/50'
            : 'border-adam-neutral-700 bg-adam-neutral-900/50 opacity-60'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 p-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded"
            style={{ backgroundColor: annotation.color || ANNOTATION_COLORS[annotation.type] }}
          >
            <Icon className="h-3.5 w-3.5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            {editingLabel ? (
              <Input
                value={labelValue}
                onChange={(e) => setLabelValue(e.target.value)}
                onBlur={handleLabelSave}
                onKeyDown={(e) => e.key === 'Enter' && handleLabelSave()}
                className="h-6 text-sm"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setEditingLabel(true)}
                className="block truncate text-left text-sm font-medium text-adam-text-primary hover:text-adam-blue"
              >
                {annotation.label}
              </button>
            )}
            <p className="truncate text-xs text-adam-text-secondary">
              {getInfoString()}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleVisibility(annotation.id)}
              className="rounded p-1 text-adam-text-secondary hover:bg-adam-neutral-700 hover:text-adam-text-primary"
            >
              {annotation.visible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => onRemove(annotation.id)}
              className="rounded p-1 text-adam-text-secondary hover:bg-red-500/20 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <CollapsibleTrigger asChild>
              <button className="rounded p-1 text-adam-text-secondary hover:bg-adam-neutral-700 hover:text-adam-text-primary">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* Expanded content */}
        <CollapsibleContent>
          <div className="space-y-3 border-t border-adam-neutral-700 p-3">
            {/* Description */}
            <div>
              <label className="mb-1 block text-xs font-medium text-adam-text-secondary">
                Description (for AI context)
              </label>
              <Textarea
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                onBlur={handleDescriptionSave}
                placeholder="E.g., 'This is the top surface that needs to be 5mm thick'"
                className="min-h-[60px] text-sm"
              />
            </div>

            {/* Parameter linking */}
            {parameters && parameters.length > 0 && (
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium text-adam-text-secondary">
                  <Link2 className="h-3 w-3" />
                  Link to Parameter
                </label>
                <Select
                  value={annotation.parameterName || '__none__'}
                  onValueChange={handleParameterLink}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select parameter..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">No parameter</SelectItem>
                    {parameters.map((param) => (
                      <SelectItem key={param.name} value={param.name}>
                        {param.displayName || param.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Type info */}
            <div className="text-xs text-adam-text-secondary">
              <span className="font-medium">Type:</span> {TYPE_LABELS[annotation.type]}
              {annotation.parameterName && (
                <>
                  {' | '}
                  <span className="font-medium">Parameter:</span>{' '}
                  {annotation.parameterName}
                </>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function AnnotationPanel({ parameters, className }: AnnotationPanelProps) {
  const {
    annotations,
    removeAnnotation,
    updateAnnotation,
    toggleAnnotationVisibility,
    hasAnnotations,
    getPromptContext,
  } = useAnnotations();

  const [showPreview, setShowPreview] = useState(false);

  if (!hasAnnotations) {
    return (
      <div className={cn('p-4', className)}>
        <div className="rounded-lg border border-dashed border-adam-neutral-600 bg-adam-neutral-800/30 p-4 text-center">
          <Tag className="mx-auto mb-2 h-8 w-8 text-adam-text-secondary" />
          <p className="text-sm font-medium text-adam-text-primary">
            No annotations yet
          </p>
          <p className="mt-1 text-xs text-adam-text-secondary">
            Select faces or points on the model to add annotations that will help
            the AI understand your intent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3 p-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-adam-text-primary">
          Annotations ({annotations.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="h-7 text-xs"
        >
          {showPreview ? 'Hide' : 'Show'} AI Context
        </Button>
      </div>

      {/* AI Context Preview */}
      {showPreview && (
        <div className="rounded-lg bg-adam-neutral-900/80 p-3">
          <p className="mb-2 text-xs font-medium text-adam-text-secondary">
            This context will be sent to the AI:
          </p>
          <pre className="whitespace-pre-wrap text-xs text-adam-text-primary/80">
            {getPromptContext()}
          </pre>
        </div>
      )}

      {/* Annotations list */}
      <div className="space-y-2">
        {annotations.map((annotation) => (
          <AnnotationItem
            key={annotation.id}
            annotation={annotation}
            parameters={parameters}
            onUpdate={updateAnnotation}
            onRemove={removeAnnotation}
            onToggleVisibility={toggleAnnotationVisibility}
          />
        ))}
      </div>
    </div>
  );
}
