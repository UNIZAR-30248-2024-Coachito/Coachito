import { SupabaseClient } from '@supabase/supabase-js';
import { ExerciseTypeRepository } from '../../repositories/exerciseTypeRepository';
import { BaseRepository } from '../../repositories/baseRepository';

jest.mock('../../repositories/baseRepository');

describe('ExerciseTypeRepository', () => {
  let supabaseMock: SupabaseClient;

  beforeEach(() => {
    supabaseMock = {} as SupabaseClient;
  });

  it('should call BaseRepository constructor with correct parameters', () => {
    new ExerciseTypeRepository(supabaseMock);
    expect(BaseRepository).toHaveBeenCalledWith(supabaseMock, 'exercise_types');
  });
});
