import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ycbxpxlrngotvxsvvtwv.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljYnhweGxybmdvdHZ4c3Z2dHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4ODQ5MDQsImV4cCI6MjA0MzQ2MDkwNH0.STYiTJU6Jq-oBp96tWpLNqnpu27bX6m1jFOQEqzuB9w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
