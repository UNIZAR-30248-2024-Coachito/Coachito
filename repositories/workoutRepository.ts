import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './baseRepository';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';

export type WorkoutRow = Tables<'workouts'>;
export type WorkoutInsert = TablesInsert<'workouts'>;
export type WorkoutUpdate = TablesUpdate<'workouts'>;

export interface WorkoutDataDB {
  id: number;
  created_at: string;
  template_id: number;
  volume: number;
  duration: string;
  template: boolean;
  workout_templates: WorkoutTemplateDB;
  workout_exercises: WorkoutExerciseDB[];
}

export interface WorkoutTemplateDB {
  name: string;
  workout_templates_group: WorkoutTemplateGroupDB;
}

export interface WorkoutExerciseDB {
  reps: number;
  sets: number;
  notes: string | null;
  weight: number | null;
  distance: number | null;
  exercises: ExerciseDB;
  rest_time: string | null;
  exercise_id: number;
  target_number_reps: number;
  created_at: string;
}

export interface ExerciseDB {
  id: number;
  name: string;
  muscle_groups: MuscleGroupDB;
  exercise_image_url: string;
  exercise_thumbnail_url: string;
}

export interface MuscleGroupDB {
  name: string;
}

export interface WorkoutTemplateGroupDB {
  id: number;
  name: string;
}

export class WorkoutRepository extends BaseRepository<
  WorkoutRow,
  WorkoutInsert,
  WorkoutUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'workouts');
  }

  async getDetailsWorkout(templateId: number): Promise<WorkoutDataDB> {
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
            exercise_thumbnail_url,
            muscle_groups (name)
          )
        )
      `
      )
      .eq('template_id', templateId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  }

  async getWorkoutsWithExercises(template: boolean): Promise<WorkoutDataDB[]> {
    let query = this.supabase
      .from(this.table)
      .select(
        `
        *,
        workout_templates!fk_workouts_template_id (
          name,
          deleted,
          workout_templates_group (
            id,
            name
          )
        ),
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
      )
      .eq('template', template);

    if (template) {
      query = query
        .is('workout_templates.deleted', 'FALSE')
        .not('workout_templates', 'is', null);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }
}
