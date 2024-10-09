import { SupabaseClient } from '@supabase/supabase-js'
import { BaseRepository } from './baseRepository'
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase'

export type WorkoutRow = Tables<'workouts'>
export type WorkoutInsert = TablesInsert<'workouts'>
export type WorkoutUpdate = TablesUpdate<'workouts'>

export class WorkoutRepository extends BaseRepository<
  WorkoutRow,
  WorkoutInsert,
  WorkoutUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'workouts')
  }
}
