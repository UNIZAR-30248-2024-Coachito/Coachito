import { supabase } from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { EquipmentCategoryInsert, EquipmentCategoryRepository, EquipmentCategoryUpdate } from '@/repositories/equipmentCategoryRepository';

const equipmentCategoryRepo = new EquipmentCategoryRepository(supabase);

const useFetchEquipmentCategories = () => {
  return useCRUD(() => equipmentCategoryRepo.getAll());
};

const useFetchEquipmentCategoryById = (id: number) => {
  return useCRUD(() => equipmentCategoryRepo.getById(id));
};

const useCreateEquipmentCategory = (newEntity: EquipmentCategoryInsert) => {
  return useCRUD(() => equipmentCategoryRepo.create(newEntity));
};

const useUpdateEquipmentCategory = (entity: EquipmentCategoryUpdate) => {
  return useCRUD(() => equipmentCategoryRepo.update(entity.id!, entity));
};

const useDeleteEquipmentCategoryById = (id: number) => {
  return useCRUD(() => equipmentCategoryRepo.delete(id));
};

export {
  useFetchEquipmentCategories,
  useFetchEquipmentCategoryById,
  useCreateEquipmentCategory,
  useUpdateEquipmentCategory,
  useDeleteEquipmentCategoryById,
};
