import { supabase } from '@/api/supabaseClient';
import {
  ExerciseInsert,
  ExerciseRepository,
  ExerciseUpdate,
} from '@/repositories/exerciseRepository';
import useCRUD from './useCRUD';

const exerciseRepo = new ExerciseRepository(supabase);

const useFetchExercises = () => {
  return useCRUD(() => exerciseRepo.getAll());
};

const useFetchExerciseById = (id: number) => {
  return useCRUD(() => exerciseRepo.getById(id));
};

const useCreateExercise = (newEntity: ExerciseInsert) => {
  return useCRUD(() => exerciseRepo.create(newEntity));
};

const useUpdateExercise = (entity: ExerciseUpdate) => {
  return useCRUD(() => exerciseRepo.update(entity.id!, entity));
};

const useDeleteExerciseById = (id: number) => {
  return useCRUD(() => exerciseRepo.delete(id));
};

export {
  useFetchExercises,
  useFetchExerciseById,
  useCreateExercise,
  useUpdateExercise,
  useDeleteExerciseById,
};
