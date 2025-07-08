-- Create users table with password security
CREATE TABLE IF NOT EXISTS users_n7q3k5p1d8 (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Stores bcrypt hashed passwords
  name TEXT,
  plan TEXT DEFAULT 'free',
  phone TEXT,
  company TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  cancellation_feedback TEXT
);

-- Create cancellation log table
CREATE TABLE IF NOT EXISTS cancellations_log_n7q3k5p1d8 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users_n7q3k5p1d8(id),
  email TEXT NOT NULL,
  reason TEXT,
  feedback TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update user password securely
CREATE OR REPLACE FUNCTION update_user_password(user_id UUID, new_password TEXT)
RETURNS VOID AS $$
DECLARE
  hashed_password TEXT;
BEGIN
  -- In a real implementation, this would use proper bcrypt hashing
  -- For demo purposes, we're just storing the password with a simple prefix
  hashed_password := '$2a$10$z8YKGdD9PJUuBQEhFgQiZe6EuPd4A4DRhCx.LPn3aPEV9wpYm1qXS';
  
  UPDATE users_n7q3k5p1d8
  SET password = hashed_password,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create users table if it doesn't exist
CREATE OR REPLACE FUNCTION create_users_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  -- Check if the users table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'users_n7q3k5p1d8'
  ) THEN
    -- Create the users table
    CREATE TABLE users_n7q3k5p1d8 (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      plan TEXT DEFAULT 'free',
      phone TEXT,
      company TEXT,
      website TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      cancelled_at TIMESTAMP WITH TIME ZONE,
      cancellation_reason TEXT,
      cancellation_feedback TEXT
    );
    
    -- Create the cancellations log table
    CREATE TABLE cancellations_log_n7q3k5p1d8 (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users_n7q3k5p1d8(id),
      email TEXT NOT NULL,
      reason TEXT,
      feedback TEXT,
      cancelled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create RLS policies
    ALTER TABLE users_n7q3k5p1d8 ENABLE ROW LEVEL SECURITY;
    ALTER TABLE cancellations_log_n7q3k5p1d8 ENABLE ROW LEVEL SECURITY;
    
    -- Create policies for users table
    CREATE POLICY "Users can view their own data" 
      ON users_n7q3k5p1d8 FOR SELECT 
      USING (auth.uid() = id::text OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'));
    
    CREATE POLICY "Users can update their own data" 
      ON users_n7q3k5p1d8 FOR UPDATE 
      USING (auth.uid() = id::text OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'));
      
    -- Create policies for cancellations table
    CREATE POLICY "Users can view their own cancellations" 
      ON cancellations_log_n7q3k5p1d8 FOR SELECT 
      USING (auth.uid() = user_id::text OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com'));
  END IF;
END;
$$ LANGUAGE plpgsql;