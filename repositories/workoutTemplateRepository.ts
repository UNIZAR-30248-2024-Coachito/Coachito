import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './baseRepository';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';

export type WorkoutTemplateRow = Tables<'workout_templates'>;
export type WorkoutTemplateInsert = TablesInsert<'workout_templates'>;
export type WorkoutTemplateUpdate = TablesUpdate<'workout_templates'>;

export class WorkoutTemplateRepository extends BaseRepository<
  WorkoutTemplateRow,
  WorkoutTemplateInsert,
  WorkoutTemplateUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'workout_templates');
  }
}
