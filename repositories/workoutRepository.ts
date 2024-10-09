import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./baseRepository";
import { Tables, TablesInsert, TablesUpdate } from "../types/supabase";

export type WorkoutRow = Tables<'workouts'>;
export type WorkoutInsert = TablesInsert<'workouts'>;
export type WorkoutUpdate = TablesUpdate<'workouts'>;

type DBDashboardWorkoutExercise = {
  sets: number;
  reps: number;
  weight?: number;
  distance?: number;
  exercise_id: number;
  exercises: {
    name: string;
    exercise_thumbnail_url: string;
    muscle_groups: {
      name: string;
    };
  };
};

type DBDashboardWorkoutSession = {
  id: number;
  created_at: string;
  template_id: number;
  volume: number;
  duration: string;
  template: boolean;
  workout_templates: {
    name: string;
  };
  workout_exercises: DBDashboardWorkoutExercise[];
};

export class WorkoutRepository extends BaseRepository<
  WorkoutRow,
  WorkoutInsert,
  WorkoutUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'workouts');
  }

  async getDashboardData(): Promise<DBDashboardWorkoutSession[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(`
        *,
        workout_templates!fk_workouts_template_id (name),
        workout_exercises (
          sets,
          reps,
          weight,
          distance,
          exercise_id,
          exercises (
            name,
            exercise_thumbnail_url,
            muscle_groups (name)
          )
        )
      `)
      .eq("template", "FALSE");
    if (error) throw error;
    return data;
  }
}
