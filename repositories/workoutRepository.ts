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
}

export interface ExerciseDB {
  name: string;
  muscle_groups: MuscleGroupDB;
  exercise_image_url: string;
  exercise_thumbnail_url: string;
}

export interface MuscleGroupDB {
  name: string;
}

export interface WorkoutTemplateGroupDB {
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

  async getTemplateWorkoutsWithExercises(): Promise<WorkoutDataDB[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(
        `
        *,
        workout_templates!fk_workouts_template_id (
          name,
          workout_templates_group (name)
        ),
        workout_exercises (
          exercises (
            name
          )
        )
      `
      )
      .eq('template', 'TRUE');

    console.log(data);
    if (error) throw error;
    return data;
  }
}
