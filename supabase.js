import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://teizyhspjjhwvnwrgmxj.supabase.co';
const supabasePublishableKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlaXp5aHNwampod3Zud3JnbXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4NTQ0ODIsImV4cCI6MjEwOTQzMDQ4Mn0.HgzYCrftZLyWELHjNFZyGJzLCH9DlYCKh5tRfOvlu_A';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);