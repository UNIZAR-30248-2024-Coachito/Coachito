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

  async getDetailsWorkoutWithExercises(
    templateId: number
  ): Promise<WorkoutExerciseDB[]> {
    // Cambiar el tipo de retorno a un array
    const { data, error } = await this.supabase
      .from(this.table)
      .select(
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
          created_at,
          exercises (
            id,
            name,
            exercise_thumbnail_url
          )
        )
      `
      )
      .eq('template_id', templateId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data; // Retorna un array de datos
  }
}
