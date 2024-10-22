import { supabase } from '@/api/supabaseClient';
import {
  ExerciseInsert,
  ExerciseRepository,
  ExerciseUpdate,
} from '@/repositories/exerciseRepository';
import useCRUD from './useCRUD';
import { mapExercisesToExerciseCardResume } from '@/mappers/mapExerciseDataToCardResume';

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

const useFetchExercisesList = async () => {
  const { execute } = useCRUD(() => exerciseRepo.getExercisesListData());

  const { data, error } = await execute();

  let exercisesResume = null;

  if (!error) {
    exercisesResume = mapExercisesToExerciseCardResume(data!);
  }

  return { exercisesResume, error };
};

export {
  useFetchExercises,
  useFetchExerciseById,
  useCreateExercise,
  useUpdateExercise,
  useDeleteExerciseById,
  useFetchExercisesList,
};
