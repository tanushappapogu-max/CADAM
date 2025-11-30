import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ShareContent } from '@/components/ShareContent';

export function ShareButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-adam-text-tertiary transition-colors duration-200 hover:bg-adam-neutral-950 hover:text-adam-neutral-10"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto flex max-h-dvh w-[calc(100%-2rem)] max-w-md flex-col items-center gap-8 rounded-lg border border-adam-neutral-800 bg-adam-bg-secondary-dark text-adam-text-primary">
        <DialogTitle className="hidden">Share public link to chat</DialogTitle>
        <DialogDescription className="hidden">
          Share public link to chat
        </DialogDescription>
        <ShareContent />
      </DialogContent>
    </Dialog>
  );
}
