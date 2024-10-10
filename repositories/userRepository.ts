import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './baseRepository';
import { Tables, TablesInsert, TablesUpdate } from '../types/supabase';

export type UserRow = Tables<'users'>;
export type UserInsert = TablesInsert<'users'>;
export type UserUpdate = TablesUpdate<'users'>;

export class UserRepository extends BaseRepository<
  UserRow,
  UserInsert,
  UserUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'users');
  }
}
