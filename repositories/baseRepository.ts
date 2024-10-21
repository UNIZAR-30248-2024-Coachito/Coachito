import { SupabaseClient } from '@supabase/supabase-js';

export class BaseRepository<RowType, InsertType, UpdateType> {
  constructor(
    protected supabase: SupabaseClient,
    protected table: string
  ) {}

  async create(newData: InsertType): Promise<RowType> {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(newData)
      .select()
      .single();
    if (error) throw error;
    return data;
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

  async update(id: number, newData: UpdateType): Promise<RowType> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(newData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<RowType> {
    const { data, error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
