import { supabase } from '@/api/supabaseClient';
import { ExerciseInsert, ExerciseRepository, ExerciseRow, ExerciseUpdate } from '@/repositories/exerciseRepository';
import useCRUD from './useCRUD';
import { ExerciseWorkoutsResume } from '@/view_models/exerciseViewModel';

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

const useFetchExerciseWorkout = (id: number) => {
  const {data: exerciseWorkouts, loading, error} = useCRUD(() => exerciseRepo.getExerciseWorkoutsData(id));

  if (!loading && !error) {
    // mapeo para info de mayor peso, mejor 1RM, etc ??

    console.log(exerciseWorkouts);
    
    return {exerciseWorkouts, loading, error}
  }

  return {exerciseWorkouts, loading, error}
}

const useFetchExercisesList = () => {
  const {data: exercisesList, loading, error} = useCRUD(() => exerciseRepo.getExercisesListData());

  if (!loading && !error) {
    console.log(exercisesList);
    
    return {exercisesList, loading, error}
  }

  return {exercisesList, loading, error}
}

export {
  useFetchExercises,
  useFetchExerciseById,
  useCreateExercise,
  useUpdateExercise,
  useDeleteExerciseById,
  useFetchExerciseWorkout,
  useFetchExercisesList,
};
