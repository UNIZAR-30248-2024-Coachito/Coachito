import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../api/supabaseClient';

jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(),
  };
});

import { createClient } from '@supabase/supabase-js';

describe('Supabase client', () => {
  it('debería llamar a createClient con la URL y clave anónima correctas', () => {
    expect(createClient).toHaveBeenCalledWith(SUPABASE_URL, SUPABASE_ANON_KEY);
  });
});
