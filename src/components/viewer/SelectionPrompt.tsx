import { useState, useRef, useEffect } from 'react';
import { useAnnotations } from '@/contexts/AnnotationContext';
import { cn } from '@/lib/utils';
import { X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SelectionPromptProps {
  onSubmit: (prompt: string, selectionContext: string) => void;
  disabled?: boolean;
}

const QUICK_ACTIONS = [
  { label: 'Fillet', prompt: 'Add a fillet to this edge' },
  { label: 'Chamfer', prompt: 'Add a chamfer to this edge' },
  { label: 'Thicken', prompt: 'Make this face thicker' },
  { label: 'Hollow', prompt: 'Hollow out this section' },
  { label: 'Round', prompt: 'Round this corner' },
  { label: 'Extend', prompt: 'Extend this surface' },
];

export function SelectionPrompt({ onSubmit, disabled }: SelectionPromptProps) {
  const { annotations, getPromptContext, clearAnnotations, hasAnnotations } = useAnnotations();
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when annotations change
  useEffect(() => {
    if (hasAnnotations && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [hasAnnotations]);

  if (!hasAnnotations) {
    return null;
  }

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    const context = getPromptContext();
    onSubmit(prompt.trim(), context);
    setPrompt('');
    clearAnnotations();
  };

  const handleQuickAction = (actionPrompt: string) => {
    const context = getPromptContext();
    onSubmit(actionPrompt, context);
    clearAnnotations();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      clearAnnotations();
    }
  };

  // Get selection summary
  const getSelectionSummary = () => {
    const faces = annotations.filter(a => a.type === 'face').length;
    const edges = annotations.filter(a => a.type === 'edge').length;
    const points = annotations.filter(a => a.type === 'point').length;

    const parts = [];
    if (faces > 0) parts.push(`${faces} face${faces > 1 ? 's' : ''}`);
    if (edges > 0) parts.push(`${edges} edge${edges > 1 ? 's' : ''}`);
    if (points > 0) parts.push(`${points} point${points > 1 ? 's' : ''}`);

    return parts.join(', ') || 'Selection';
  };

  return (
    <div className="absolute bottom-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 transform">
      <div className="rounded-xl border border-adam-neutral-600 bg-adam-neutral-800/95 p-3 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-adam-blue" />
            <span className="text-sm font-medium text-adam-text-primary">
              {getSelectionSummary()} selected
            </span>
          </div>
          <button
            onClick={clearAnnotations}
            className="rounded p-1 text-adam-text-secondary hover:bg-adam-neutral-700 hover:text-adam-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-2 flex flex-wrap gap-1">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.prompt)}
              disabled={disabled}
              className={cn(
                'rounded-md border border-adam-neutral-600 bg-adam-neutral-700/50 px-2 py-1 text-xs font-medium text-adam-text-secondary transition-all',
                'hover:border-adam-blue hover:bg-adam-blue/10 hover:text-adam-blue',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Custom prompt input */}
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to do with this selection?"
            disabled={disabled}
            className="min-h-[40px] flex-1 resize-none rounded-lg border-adam-neutral-600 bg-adam-neutral-700/50 text-sm"
            rows={1}
          />
          <Button
            onClick={handleSubmit}
            disabled={disabled || !prompt.trim()}
            size="icon"
            className="h-10 w-10 bg-adam-blue hover:bg-adam-blue/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 text-center text-xs text-adam-text-secondary">
          Press Enter to send, Esc to cancel
        </p>
      </div>
    </div>
  );
}
