import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './baseRepository';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';

export type ExerciseRow = Tables<'exercises'>;
export type ExerciseInsert = TablesInsert<'exercises'>;
export type ExerciseUpdate = TablesUpdate<'exercises'>;

export type ExercisesListDB = {
  id: number;
  name: string;
  exercise_thumbnail_url: string;
  muscle_groups: MuscleGroupDB;
  equipment_categories: EquipmentCategoriesDB;
};

export interface MuscleGroupDB {
  name: string;
}

export interface EquipmentCategoriesDB {
  name: string;
}

export class ExerciseRepository extends BaseRepository<
  ExerciseRow,
  ExerciseInsert,
  ExerciseUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'exercises');
  }

  async getExercisesListData(): Promise<ExercisesListDB[]> {
    const { data, error } = await this.supabase.from(this.table).select(`
        id,
        name,
        exercise_thumbnail_url,
        muscle_groups (name),
        equipment_categories (name)
      `);
    if (error) throw error;

    // @ts-expect-error Ignorar el error de tipo en la siguiente línea
    return data;
  }
}
