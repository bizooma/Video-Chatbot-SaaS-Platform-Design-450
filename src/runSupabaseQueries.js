import supabase from './lib/supabase';

const createVolunteersTable = async () => {
  try {
    const { error } = await supabase.query(`
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
    `);
    
    if (error) {
      console.error('Error creating volunteers table:', error);
    } else {
      console.log('Volunteers table created successfully');
    }
  } catch (error) {
    console.error('Error in createVolunteersTable:', error);
  }
};

// Run this function to create the table
createVolunteersTable();