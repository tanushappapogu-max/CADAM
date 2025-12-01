import { useParams, Link } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { Message } from '@shared/types';
import { useState } from 'react';
import { CurrentMessageContext } from '@/contexts/CurrentMessageContext';
import { SelectedItemsContext } from '@/contexts/SelectedItemsContext';
import { BlobContext } from '@/contexts/BlobContext';
import { ColorContext } from '@/contexts/ColorContext';
import { MessageItem } from '@/types/misc';
import {
  usePublicConversation,
  usePublicMessages,
} from '@/services/shareService';
import { ParametricEditor } from '@/components/ParametricEditor';
import { Button } from '@/components/ui/button';

export default function ShareView() {
  const { id: conversationId } = useParams();
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [images, setImages] = useState<MessageItem[]>([]);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [color, setColor] = useState<string>('#00A6FF');

  const {
    data: conversation,
    isLoading: isConversationLoading,
    error: conversationError,
  } = usePublicConversation(conversationId);

  const { data: messages = [] } = usePublicMessages(
    conversationId,
    !!conversation,
  );

  if (isConversationLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-adam-bg-secondary-dark text-adam-text-primary">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (conversationError || !conversation) {
    const isPrivate = conversationError?.message?.includes('not public');
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-adam-bg-secondary-dark text-adam-text-primary">
        {isPrivate ? (
          <>
            <Lock className="h-12 w-12 text-adam-text-secondary" />
            <span className="text-xl font-medium">
              This conversation is private
            </span>
            <span className="text-sm text-adam-text-secondary">
              The owner has made this conversation private
            </span>
          </>
        ) : (
          <>
            <span className="text-2xl font-medium">404</span>
            <span className="text-sm text-adam-text-secondary">
              Conversation not found
            </span>
          </>
        )}
        <Link to="/">
          <Button variant="secondary" className="mt-4">
            Go to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <CurrentMessageContext.Provider
      value={{
        currentMessage,
        setCurrentMessage,
      }}
    >
      <BlobContext.Provider value={{ blob, setBlob }}>
        <ColorContext.Provider value={{ color, setColor }}>
          <SelectedItemsContext.Provider value={{ images, setImages }}>
            <ParametricEditor
              isReadOnly
              externalMessages={messages}
              externalConversation={conversation}
            />
          </SelectedItemsContext.Provider>
        </ColorContext.Provider>
      </BlobContext.Provider>
    </CurrentMessageContext.Provider>
  );
}
