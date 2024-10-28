import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './baseRepository';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';
import { WorkoutExerciseDB } from './workoutRepository';

export type WorkoutExerciseRow = Tables<'workout_exercises'>;
export type WorkoutExerciseInsert = TablesInsert<'workout_exercises'>;
export type WorkoutExerciseUpdate = TablesUpdate<'workout_exercises'>;

export class WorkoutExerciseRepository extends BaseRepository<
  WorkoutExerciseRow,
  WorkoutExerciseInsert,
  WorkoutExerciseUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'workout_exercises');
  }

  async getExerciseDetails(exerciseId: number): Promise<WorkoutExerciseDB[]> {
    const query = this.supabase
      .from(this.table)
      .select(
        `
        *,
        exercises (
          name,
          exercise_image_url,
          muscle_groups (name)
        )
      `
      )
      .eq('exercise_id', exerciseId);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }
}
