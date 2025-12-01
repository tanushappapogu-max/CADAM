import { Button } from '@/components/ui/button';
import { ClipboardCheck, CopyIcon, Loader2 } from 'lucide-react';
import { useConversation } from '@/services/conversationService';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

type ShareState = 'idle' | 'updating' | 'copied';

export function ShareContent() {
  const { conversation, updateConversationAsync } = useConversation();
  const [shareState, setShareState] = useState<ShareState>('idle');

  const shareLink = `${window.location.origin}${import.meta.env.BASE_URL}share/${conversation.id}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareLink);
    setShareState('copied');
    // setTimeout used here to reset the "copied" UI state after visual feedback
    setTimeout(() => {
      setShareState('idle');
    }, 2000);
  };

  const handlePublicClick = async () => {
    if (!updateConversationAsync) {
      toast({
        title: 'Error',
        description: 'Unable to update conversation',
        variant: 'destructive',
      });
      return;
    }

    setShareState('updating');
    try {
      await updateConversationAsync({
        ...conversation,
        privacy: 'public',
      });
      await copyToClipboard();
      toast({
        title: 'Link copied!',
        description: 'Anyone with the link can now view this conversation',
      });
    } catch (error) {
      setShareState('idle');
      toast({
        title: 'Failed to share',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleMakePrivate = async () => {
    if (!updateConversationAsync) {
      toast({
        title: 'Error',
        description: 'Unable to update conversation',
        variant: 'destructive',
      });
      return;
    }

    setShareState('updating');
    try {
      await updateConversationAsync({
        ...conversation,
        privacy: 'private',
      });
      setShareState('idle');
      toast({
        title: 'Made private',
        description: 'Only you can view this conversation now',
      });
    } catch (error) {
      setShareState('idle');
      toast({
        title: 'Failed to make private',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const isPublic = conversation.privacy === 'public';
  const isUpdating = shareState === 'updating';
  const justCopied = shareState === 'copied';

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="font-medium text-adam-neutral-100">
          Share public link to chat
        </div>
        <div className="flex items-center gap-3 text-xs text-adam-text-secondary">
          {isPublic ? (
            <div className="ml-1 h-1 w-1 rounded-full bg-[#64D557] outline outline-4 outline-[#79FF6B]/30" />
          ) : (
            <div className="h-3 w-3 rounded-full bg-[#FF392F] outline outline-2 outline-[#FF0000]/30" />
          )}
          {isPublic ? 'Anyone with the link can view' : 'Only you can view'}
        </div>
      </div>

      {isPublic && (
        <div className="flex w-full items-center justify-between gap-4 rounded-full bg-adam-neutral-950 py-2 pl-6 pr-2">
          <span className="min-w-0 flex-1 truncate text-sm text-adam-neutral-100">
            {shareLink}
          </span>
          <button
            onClick={copyToClipboard}
            disabled={isUpdating}
            className="flex shrink-0 items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black focus:outline-none disabled:opacity-50"
          >
            {justCopied ? (
              <ClipboardCheck className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
            {justCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}

      {isPublic ? (
        <Button
          variant="destructive"
          onClick={handleMakePrivate}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Make Private'
          )}
        </Button>
      ) : (
        <Button
          variant="secondary"
          onClick={handlePublicClick}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sharing...
            </>
          ) : (
            'Share'
          )}
        </Button>
      )}
    </div>
  );
}
