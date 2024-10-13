import { supabase } from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { ExerciseRepository } from '@/repositories/exerciseRepository';
import { mapExercisesToCardResume } from '@/mappers/mapExerciseDataToCardResume';

const exerciseRepository = new ExerciseRepository(supabase);

const useFetchAddExercise = () => {
  const { data, loading, error } = useCRUD(() =>
    exerciseRepository.getExercisesWithPrimaryMuscleGroup()
  );
  let exerciseResumes = null;

  if (!loading && !error) {
    exerciseResumes = mapExercisesToCardResume(data!);
  }

  return { exerciseResumes, loading, error };
};
export { useFetchAddExercise };
