-- Add privacy field to conversations table for sharing functionality
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS privacy TEXT DEFAULT 'private' CHECK (privacy IN ('public', 'private'));

-- Create index for faster lookups of public conversations
CREATE INDEX IF NOT EXISTS idx_conversations_privacy ON conversations(privacy);

-- Add RLS policy to allow public conversations to be viewed by anyone
CREATE POLICY "Public conversations are viewable by everyone"
ON conversations FOR SELECT
USING (privacy = 'public');

