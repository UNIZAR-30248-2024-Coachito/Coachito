import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './baseRepository';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';

export type ExerciseTypeRow = Tables<'exercise_types'>;
export type ExerciseTypeInsert = TablesInsert<'exercise_types'>;
export type ExerciseTypeUpdate = TablesUpdate<'exercise_types'>;

export class ExerciseTypeRepository extends BaseRepository<
  ExerciseTypeRow,
  ExerciseTypeInsert,
  ExerciseTypeUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'exercise_types');
  }
}
