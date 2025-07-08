-- Create volunteers table for storing volunteer sign-ups from chatbot
CREATE TABLE IF NOT EXISTS volunteers_x9k2m7p1q (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  available_days TEXT,
  chatbot_id TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE volunteers_x9k2m7p1q ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all inserts" ON volunteers_x9k2m7p1q FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all reads" ON volunteers_x9k2m7p1q FOR SELECT TO public USING (true);
CREATE POLICY "Allow all updates" ON volunteers_x9k2m7p1q FOR UPDATE TO public USING (true);

-- Create function to create volunteers table if it doesn't exist
CREATE OR REPLACE FUNCTION create_volunteers_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  -- Check if the volunteers table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'volunteers_x9k2m7p1q'
  ) THEN
    -- Create the volunteers table
    CREATE TABLE volunteers_x9k2m7p1q (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      available_days TEXT,
      chatbot_id TEXT,
      status TEXT DEFAULT 'new',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create RLS policies
    ALTER TABLE volunteers_x9k2m7p1q ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Allow all inserts" ON volunteers_x9k2m7p1q 
      FOR INSERT TO public WITH CHECK (true);
      
    CREATE POLICY "Allow all reads" ON volunteers_x9k2m7p1q 
      FOR SELECT TO public USING (true);
      
    CREATE POLICY "Allow all updates" ON volunteers_x9k2m7p1q 
      FOR UPDATE TO public USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql;