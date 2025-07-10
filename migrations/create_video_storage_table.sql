-- Create chatbot videos table for storing video metadata
CREATE TABLE IF NOT EXISTS chatbot_videos_x7k9p2q1 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    duration FLOAT DEFAULT 0,
    storage_path TEXT NOT NULL,
    thumbnail_path TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    upload_status TEXT DEFAULT 'pending',
    processing_status TEXT DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chatbot_videos_x7k9p2q1 ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own videos" ON chatbot_videos_x7k9p2q1 
FOR ALL TO public 
USING (user_id = auth.uid()::text);

CREATE POLICY "Public can view completed videos" ON chatbot_videos_x7k9p2q1 
FOR SELECT TO public 
USING (upload_status = 'completed');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbot_videos_chatbot_id ON chatbot_videos_x7k9p2q1(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_videos_user_id ON chatbot_videos_x7k9p2q1(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_videos_status ON chatbot_videos_x7k9p2q1(upload_status);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_chatbot_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_chatbot_videos_updated_at
    BEFORE UPDATE ON chatbot_videos_x7k9p2q1
    FOR EACH ROW
    EXECUTE FUNCTION update_chatbot_videos_updated_at();