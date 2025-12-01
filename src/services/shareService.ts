import { supabase } from '@/lib/supabase';
import { Conversation, Content, Message } from '@shared/types';
import { useQuery } from '@tanstack/react-query';

export function usePublicConversation(conversationId: string | undefined) {
  return useQuery<Conversation>({
    queryKey: ['public-conversation', conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      if (!conversationId) {
        throw new Error('Conversation ID is required');
      }

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('privacy', 'public')
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Check if conversation exists but is private
          const { data: privateCheck } = await supabase
            .from('conversations')
            .select('id')
            .eq('id', conversationId)
            .limit(1)
            .maybeSingle();

          if (privateCheck) {
            throw new Error('This conversation is not public');
          }
        }
        throw error;
      }
      return data;
    },
  });
}

export function usePublicMessages(
  conversationId: string | undefined,
  enabled: boolean,
) {
  return useQuery<Message[]>({
    queryKey: ['public-messages', conversationId],
    enabled: !!conversationId && enabled,
    queryFn: async () => {
      if (!conversationId) {
        throw new Error('Conversation ID is required');
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .overrideTypes<
          Array<{ content: Content; role: 'user' | 'assistant' }>
        >();

      if (error) throw error;
      return data || [];
    },
  });
}
