import { SupabaseClient } from '@supabase/supabase-js';
import { WorkoutTemplateRepository } from '../../repositories/workoutTemplateRepository';
import { BaseRepository } from '../../repositories/baseRepository';

jest.mock('../../repositories/baseRepository');

describe('WorkoutTemplateRepository', () => {
  let supabaseMock: SupabaseClient;

  beforeEach(() => {
    supabaseMock = {} as SupabaseClient;
  });

  it('should call BaseRepository constructor with correct parameters', () => {
    new WorkoutTemplateRepository(supabaseMock);
    expect(BaseRepository).toHaveBeenCalledWith(
      supabaseMock,
      'workout_templates'
    );
  });
});
