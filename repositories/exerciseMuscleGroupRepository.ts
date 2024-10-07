import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./baseRepository";
import { Tables, TablesInsert, TablesUpdate } from "../types/supabase";

export type ExerciseMuscleGroupRow = Tables<'exercises_muscle_groups'>;
export type ExerciseMuscleGroupInsert = TablesInsert<'exercises_muscle_groups'>;
export type ExerciseMuscleGroupUpdate = TablesUpdate<'exercises_muscle_groups'>;

export class ExerciseMuscleGroupRepository extends BaseRepository<
  ExerciseMuscleGroupRow,
  ExerciseMuscleGroupInsert,
  ExerciseMuscleGroupUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'exercises_muscle_groups');
  }
}
