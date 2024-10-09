import { SupabaseClient } from '@supabase/supabase-js'
import { BaseRepository } from './baseRepository'
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase'

export type MuscleGroupRow = Tables<'muscle_groups'>
export type MuscleGroupInsert = TablesInsert<'muscle_groups'>
export type MuscleGroupUpdate = TablesUpdate<'muscle_groups'>

export class MuscleGroupRepository extends BaseRepository<
  MuscleGroupRow,
  MuscleGroupInsert,
  MuscleGroupUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'muscle_groups')
  }
}
