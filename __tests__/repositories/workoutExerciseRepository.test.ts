import { SupabaseClient } from '@supabase/supabase-js';
import { WorkoutExerciseRepository } from '../../repositories/workoutExerciseRepository';
import { BaseRepository } from '../../repositories/baseRepository';

jest.mock('../../repositories/baseRepository');

describe('WorkoutExerciseRepository', () => {
  let supabaseMock: SupabaseClient;

  beforeEach(() => {
    supabaseMock = {} as SupabaseClient;
  });

  it('should call BaseRepository constructor with correct parameters', () => {
    new WorkoutExerciseRepository(supabaseMock);
    expect(BaseRepository).toHaveBeenCalledWith(
      supabaseMock,
      'workout_exercises'
    );
  });
});
