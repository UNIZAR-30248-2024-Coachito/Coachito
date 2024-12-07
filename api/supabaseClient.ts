import axios from 'axios';

export const SUPABASE_URL = 'https://ycbxpxlrngotvxsvvtwv.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljYnhweGxybmdvdHZ4c3Z2dHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4ODQ5MDQsImV4cCI6MjA0MzQ2MDkwNH0.STYiTJU6Jq-oBp96tWpLNqnpu27bX6m1jFOQEqzuB9w';

const supabaseClient = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    'Content-Type': 'application/json',
    apiKey: SUPABASE_ANON_KEY,
    Prefer: 'return=representation',
  },
});
/*
export const setAuthToken = (token: string) => {
  supabaseClient.defaults.headers['Authorization'] = `Bearer ${token}`;
};
*/
export default supabaseClient;
