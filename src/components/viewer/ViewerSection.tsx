import { ImageGallery } from './ImageGallery';
import { useCurrentMessage } from '@/contexts/CurrentMessageContext';
import Loader from './Loader';
import { OpenSCADViewer } from './OpenSCADViewer';
import { useIsLoading, useSendContentMutation } from '@/services/messageService';
import { SelectionPrompt } from './SelectionPrompt';
import { useConversation } from '@/services/conversationService';

export function ViewerSection() {
  const isLoading = useIsLoading();
  const { currentMessage: message } = useCurrentMessage();
  const { conversation } = useConversation();
  const { mutate: sendMessage } = useSendContentMutation({ conversation });

  // Handle selection-based prompts
  const handleSelectionPrompt = (prompt: string, selectionContext: string) => {
    // Combine the user's prompt with the selection context
    const fullText = `${selectionContext}\n\n${prompt}`;
    sendMessage({
      text: fullText,
      model: message?.content.model || 'google/gemini-2.5-flash-preview-05-20',
    });
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-adam-neutral-700">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader message="Generating model" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2">
          {message?.content.images && Array.isArray(message.content.images) && (
            <ImageGallery imageIds={message.content.images} />
          )}
          {message?.content.artifact?.code && <OpenSCADViewer />}
        </div>
      )}

      {/* Selection prompt overlay */}
      {message?.content.artifact?.code && (
        <SelectionPrompt onSubmit={handleSelectionPrompt} disabled={isLoading} />
      )}
    </div>
  );
}
