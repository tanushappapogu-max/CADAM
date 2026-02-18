-- Add mode column to conversations table to separate engineering and architecture conversations
ALTER TABLE "public"."conversations" ADD COLUMN "mode" text NOT NULL DEFAULT 'engineering';

-- Index for filtering by mode
CREATE INDEX IF NOT EXISTS conversations_mode_idx ON "public"."conversations" USING btree (mode);
