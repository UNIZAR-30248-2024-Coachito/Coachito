import { supabase } from '@/api/supabaseClient';
import { ExerciseRepository } from '@/repositories/exerciseRepository';
import useCRUD from './useCRUD';
import { mapExercisesToExerciseCardResume } from '@/mappers/mapExerciseDataToCardResume';

const exerciseRepo = new ExerciseRepository(supabase);

const useFetchExercisesList = async () => {
  const { execute } = useCRUD(() => exerciseRepo.getExercisesListData());

  const { data, error } = await execute();

  let exercisesResume = null;

  if (!error) {
    exercisesResume = mapExercisesToExerciseCardResume(data!);
  }

  return { exercisesResume, error };
};

export { useFetchExercisesList };
