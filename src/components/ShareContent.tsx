import { Button } from '@/components/ui/button';
import { ClipboardCheck, CopyIcon } from 'lucide-react';
import { useConversation } from '@/services/conversationService';
import { useState } from 'react';

export function ShareContent() {
  const { conversation, updateConversation } = useConversation();
  const [justCopied, setJustCopied] = useState(false);

  function handleChangePrivacy(privacy: 'public' | 'private') {
    updateConversation?.({
      ...conversation,
      privacy,
    });
  }

  const handlePublicClick = () => {
    handleChangePrivacy('public');
    copyToClipboard();
  };

  const shareLink = `${window.location.origin}${import.meta.env.BASE_URL}share/${conversation.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setJustCopied(true);
    // setTimeout used here to reset the "copied" UI state after visual feedback
    setTimeout(() => {
      setJustCopied(false);
    }, 2000);
  };

  const isPublic = conversation.privacy === 'public';

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
            className="flex shrink-0 items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black focus:outline-none"
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
          onClick={() => handleChangePrivacy('private')}
        >
          Make Private
        </Button>
      ) : (
        <Button variant="secondary" onClick={handlePublicClick}>
          Share
        </Button>
      )}
    </div>
  );
}
