import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./baseRepository";
import { Tables, TablesInsert, TablesUpdate } from "../types/supabase";

export type EquipmentCategoryRow = Tables<'equipment_categories'>;
export type EquipmentCategoryInsert = TablesInsert<'equipment_categories'>;
export type EquipmentCategoryUpdate = TablesUpdate<'equipment_categories'>;

export class EquipmentCategoryRepository extends BaseRepository<
  EquipmentCategoryRow,
  EquipmentCategoryInsert,
  EquipmentCategoryUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'equipment_categories');
  }
}
