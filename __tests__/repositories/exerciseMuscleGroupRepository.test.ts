import { SupabaseClient } from '@supabase/supabase-js';
import { ExerciseMuscleGroupRepository } from '../../repositories/exerciseMuscleGroupRepository';
import { BaseRepository } from '../../repositories/baseRepository';

jest.mock('../../repositories/baseRepository');

describe('ExerciseMuscleGroupRepository', () => {
  let supabaseMock: SupabaseClient;

  beforeEach(() => {
    supabaseMock = {} as SupabaseClient;
  });

  it('should call BaseRepository constructor with correct parameters', () => {
    new ExerciseMuscleGroupRepository(supabaseMock);
    expect(BaseRepository).toHaveBeenCalledWith(
      supabaseMock,
      'exercises_muscle_groups'
    );
  });
});
