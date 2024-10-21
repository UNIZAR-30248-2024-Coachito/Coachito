import { SupabaseClient } from '@supabase/supabase-js';
import { EquipmentCategoryRepository } from '../../repositories/equipmentCategoryRepository';
import { BaseRepository } from '../../repositories/baseRepository';

jest.mock('../../repositories/baseRepository');

describe('EquipmentCategoryRepository', () => {
  let supabaseMock: SupabaseClient;

  beforeEach(() => {
    supabaseMock = {} as SupabaseClient;
  });

  it('should call BaseRepository constructor with correct parameters', () => {
    new EquipmentCategoryRepository(supabaseMock);
    expect(BaseRepository).toHaveBeenCalledWith(
      supabaseMock,
      'equipment_categories'
    );
  });
});
