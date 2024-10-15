import { SupabaseClient } from '@supabase/supabase-js';

export class BaseRepository<RowType, InsertType, UpdateType> {
  protected table: string;

  constructor(
    protected supabase: SupabaseClient,
    table: string
  ) {
    this.table = table;
  }

  async create(data: InsertType): Promise<RowType> {
    const { data: newData, error } = await this.supabase
      .from(this.table)
      .insert(data)
      .single();
    if (error) throw error;
    return newData;
  }

  async getAll(): Promise<RowType[]> {
    const { data, error } = await this.supabase.from(this.table).select('*');
    if (error) throw error;
    return data;
  }

  async getById(id: number): Promise<RowType> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: number, data: UpdateType): Promise<RowType> {
    const { data: updatedData, error } = await this.supabase
      .from(this.table)
      .update(data)
      .eq('id', id)
      .single();
    if (error) throw error;
    return updatedData;
  }

  async delete(id: number): Promise<RowType> {
    console.log(id);
    const { data, error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id)
      .single();
    console.log(error);
    console.log(data);
    if (error) throw error;
    return data;
  }
}
