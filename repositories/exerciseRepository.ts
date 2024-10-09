import { SupabaseClient } from '@supabase/supabase-js'
import { BaseRepository } from './baseRepository'
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase'

export type ExerciseRow = Tables<'exercises'>
export type ExerciseInsert = TablesInsert<'exercises'>
export type ExerciseUpdate = TablesUpdate<'exercises'>

export class ExerciseRepository extends BaseRepository<
  ExerciseRow,
  ExerciseInsert,
  ExerciseUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'exercises')
  }
}
