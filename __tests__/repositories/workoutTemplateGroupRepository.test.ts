import { SupabaseClient } from '@supabase/supabase-js';
import { WorkoutTemplateGroupRepository } from '../../repositories/workoutTemplateGroupRepository';
import { BaseRepository } from '../../repositories/baseRepository';

jest.mock('../../repositories/baseRepository');

describe('WorkoutTemplateGroupRepository', () => {
  let supabaseMock: SupabaseClient;

  beforeEach(() => {
    supabaseMock = {} as SupabaseClient;
  });

  it('should call BaseRepository constructor with correct parameters', () => {
    new WorkoutTemplateGroupRepository(supabaseMock);
    expect(BaseRepository).toHaveBeenCalledWith(
      supabaseMock,
      'workout_templates_group'
    );
  });
});
