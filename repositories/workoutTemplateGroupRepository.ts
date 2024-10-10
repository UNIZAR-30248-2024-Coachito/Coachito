import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './baseRepository';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';

export type WorkoutTemplateGroupRow = Tables<'workout_templates_group'>;
export type WorkoutTemplateGroupInsert =
  TablesInsert<'workout_templates_group'>;
export type WorkoutTemplateGroupUpdate =
  TablesUpdate<'workout_templates_group'>;

export class WorkoutTemplateGroupRepository extends BaseRepository<
  WorkoutTemplateGroupRow,
  WorkoutTemplateGroupInsert,
  WorkoutTemplateGroupUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'workout_templates_group');
  }
}
