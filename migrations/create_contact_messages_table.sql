-- Create contact messages table for storing chatbot inquiries
CREATE TABLE IF NOT EXISTS contact_messages_x9k2m7p1q (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  chatbot_id TEXT,
  recipient_email TEXT,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_messages_x9k2m7p1q ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all inserts" ON contact_messages_x9k2m7p1q FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all reads" ON contact_messages_x9k2m7p1q FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates" ON contact_messages_x9k2m7p1q FOR UPDATE TO public USING (true);