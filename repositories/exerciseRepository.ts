import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./baseRepository";
import { Tables, TablesInsert, TablesUpdate } from "../types/supabase";

export type ExerciseRow = Tables<'exercises'>;
export type ExerciseInsert = TablesInsert<'exercises'>;
export type ExerciseUpdate = TablesUpdate<'exercises'>;

type DBWorkouts = {
  workout_id: number;
  sets: number;
  reps: number;
  weight?: number;
  distance?: number;
};

type DBExerciseWorkouts = {
  name: string;
  exercise_image_url: string;
  muscle_groups: {
    name: string;
  }[];
  exercises_muscle_groups: {
    muscle_groups: {
      name: string;
    }[];
  }[];
  workout_exercises: DBWorkouts[];
};

type DBExercisesList = {
  name: string;
  exercise_thumbnail_url: string;
  muscle_groups: {
    name: string;
  }[];
  equipment_categories: {
    name: string;
  }[];
};

export class ExerciseRepository extends BaseRepository<
  ExerciseRow,
  ExerciseInsert,
  ExerciseUpdate
> {
  constructor(supabase: SupabaseClient) {
      super(supabase, 'exercises');
  }

  async getExerciseWorkoutsData(id: number): Promise<DBExerciseWorkouts> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(`
        name,
        exercise_image_url,
        muscle_groups (name),
        exercises_muscle_groups (
          muscle_group_id,
          muscle_groups (name)
        ),
        workout_exercises (
          workout_id,
          sets,
          reps,
          weight,
          distance
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async getExercisesListData(): Promise<DBExercisesList[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(`
        name,
        exercise_thumbnail_url,
        muscle_groups (name),
        equipment_categories (name)
      `);
    if (error) throw error;
    return data;
  }
}
