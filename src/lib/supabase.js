import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zloaxhkkbjwdmmfpsxdh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsb2F4aGtrYmp3ZG1tZnBzeGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODAxMjMsImV4cCI6MjA2NzU1NjEyM30.jgf5iWb-YE0-OXPGpNitPhvbAahy8r0tQ_8Vr5wLzLs'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>' ){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})