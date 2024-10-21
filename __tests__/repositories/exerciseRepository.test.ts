import { SupabaseClient } from '@supabase/supabase-js';
import { ExerciseRepository } from '../../repositories/exerciseRepository';
import { BaseRepository } from '../../repositories/baseRepository';

jest.mock('../../repositories/baseRepository');

describe('ExerciseRepository', () => {
  let supabaseMock: SupabaseClient;

  beforeEach(() => {
    supabaseMock = {} as SupabaseClient;
  });

  it('should call BaseRepository constructor with correct parameters', () => {
    new ExerciseRepository(supabaseMock);
    expect(BaseRepository).toHaveBeenCalledWith(supabaseMock, 'exercises');
  });
});
