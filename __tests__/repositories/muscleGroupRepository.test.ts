import { SupabaseClient } from '@supabase/supabase-js';
import { MuscleGroupRepository } from '../../repositories/muscleGroupRepository';
import { BaseRepository } from '../../repositories/baseRepository';

jest.mock('../../repositories/baseRepository');

describe('MuscleGroupRepository', () => {
  let supabaseMock: SupabaseClient;

  beforeEach(() => {
    supabaseMock = {} as SupabaseClient;
  });

  it('should call BaseRepository constructor with correct parameters', () => {
    new MuscleGroupRepository(supabaseMock);
    expect(BaseRepository).toHaveBeenCalledWith(supabaseMock, 'muscle_groups');
  });
});
