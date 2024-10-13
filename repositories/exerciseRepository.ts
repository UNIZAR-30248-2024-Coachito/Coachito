import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './baseRepository';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';

export type ExerciseRow = Tables<'exercises'>;
export type ExerciseInsert = TablesInsert<'exercises'>;
export type ExerciseUpdate = TablesUpdate<'exercises'>;

interface MuscleGroupDB {
  name: string;
}

interface ExerciseDB {
  id: number;
  name: string;
  exercise_thumbnail_url: string;
  exercise_image_url: string;
  exercise_type_id: number;
  equipment_category_id: number;
  primary_muscle_group_id: number;
  muscle_groups: MuscleGroupDB;
}

export class ExerciseRepository extends BaseRepository<
  ExerciseRow,
  ExerciseInsert,
  ExerciseUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'exercises');
  }
  async getExercisesWithPrimaryMuscleGroup(): Promise<ExerciseDB[]> {
    const { data, error } = await this.supabase.from(this.table).select(
      `
        *,
        muscle_groups!exercises_muscle_group_id_fkey (name)
      `
    );
    if (error) throw error;
    return data;
  }
}
