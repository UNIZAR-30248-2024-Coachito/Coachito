import { WorkoutRepository } from '../../repositories/workoutRepository';
import { BaseRepository } from '../../repositories/baseRepository';
import { createClient } from '../../__mocks__/@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

jest.mock('../../repositories/baseRepository');

class TestWorkoutRepository extends WorkoutRepository {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient);
    this.setSupabase(supabaseClient);
    this.setTable('workouts');
  }

  setSupabase(client: SupabaseClient) {
    this.supabase = client;
  }

  setTable(tableName: string) {
    this.table = tableName;
  }
}

describe('WorkoutRepository', () => {
  let mockSupabaseClient: ReturnType<typeof createClient>;
  let repository: TestWorkoutRepository;

  beforeEach(() => {
    mockSupabaseClient = createClient();
    repository = new TestWorkoutRepository(mockSupabaseClient);
  });

  it('should call BaseRepository constructor with correct parameters', () => {
    expect(BaseRepository).toHaveBeenCalledWith(mockSupabaseClient, 'workouts');
  });

  it('should get workouts with exercises', async () => {
    const fromMock = mockSupabaseClient.from('workouts');
    const selectMock = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            created_at: '2024-01-01',
            template_id: 2,
            volume: 10,
            duration: '1h',
            template: false,
            workout_templates: { name: 'Template A' },
            workout_exercises: [],
          },
        ],
        error: null,
      }),
    });

    fromMock.select = selectMock;

    mockSupabaseClient.from.mockReturnValue(fromMock);

    await repository.getWorkoutsWithExercises();

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('workouts');
    expect(selectMock).toHaveBeenCalledWith(
      `
        *,
        workout_templates!fk_workouts_template_id (name),
        workout_exercises (
          sets,
          reps,
          weight,
          distance,
          notes,
          rest_time,
          target_number_reps,
          exercise_id,
          exercises (
            name,
            exercise_thumbnail_url,
            exercise_image_url,
            muscle_groups (name)
          )
        )
      `
    );
    expect(selectMock().eq).toHaveBeenCalledWith('template', 'FALSE');
  });

  it('should throw an error if there is an error fetching workouts', async () => {
    mockSupabaseClient.from.mockImplementation(() => ({
      select: jest.fn().mockReturnValue({
        eq: jest
          .fn()
          .mockResolvedValue({ data: null, error: new Error('Error') }),
      }),
    }));

    await expect(repository.getWorkoutsWithExercises()).rejects.toThrow(
      'Error'
    );
  });
});
