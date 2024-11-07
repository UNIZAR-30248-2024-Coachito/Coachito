import axios from 'axios';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../api/supabaseClient';

jest.mock('axios');

describe('Supabase client (axios)', () => {
  it('debería crear una instancia de axios con la URL y clave anónima correctas', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: `${SUPABASE_URL}/rest/v1`,
      headers: {
        'Content-Type': 'application/json',
        apiKey: SUPABASE_ANON_KEY,
        Prefer: 'return=representation',
      },
    });
  });
});
