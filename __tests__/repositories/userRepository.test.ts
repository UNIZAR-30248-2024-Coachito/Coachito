import { SupabaseClient } from '@supabase/supabase-js';
import { UserRepository } from '../../repositories/userRepository';
import { BaseRepository } from '../../repositories/baseRepository';

jest.mock('../../repositories/baseRepository');

describe('UserRepository', () => {
  let supabaseMock: SupabaseClient;

  beforeEach(() => {
    supabaseMock = {} as SupabaseClient;
  });

  it('should call BaseRepository constructor with correct parameters', () => {
    new UserRepository(supabaseMock);
    expect(BaseRepository).toHaveBeenCalledWith(supabaseMock, 'users');
  });
});
