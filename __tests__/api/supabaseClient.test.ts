import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/api/supabaseClient';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('Supabase client (createClient)', () => {
  it('debería crear una instancia de Supabase con la URL y clave anónima correctas', () => {
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    expect(createClient).toHaveBeenCalledWith(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  });
});
