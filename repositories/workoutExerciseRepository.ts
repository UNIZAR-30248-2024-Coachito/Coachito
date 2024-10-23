import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './baseRepository';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';

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
}
