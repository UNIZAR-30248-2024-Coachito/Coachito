import { supabase } from '@/api/supabaseClient';
import { ExerciseRepository } from '@/repositories/exerciseRepository';
import useCRUD from './useCRUD';
import { mapExercisesToExerciseCardResume } from '@/mappers/mapExerciseDataToCardResume';
import { WorkoutExerciseRepository } from '@/repositories/workoutExerciseRepository';
import { mapExerciseDataToExerciseDetails } from '@/mappers/mapExerciseDataToExerciseDetails';

const exerciseRepo = new ExerciseRepository(supabase);
const workoutExerciseRepo = new WorkoutExerciseRepository(supabase);

const useFetchExercisesList = async () => {
  const { execute } = useCRUD(() => exerciseRepo.getExercisesListData());

  const { data, error } = await execute();

  let exercisesResume = null;

  if (!error) {
    exercisesResume = mapExercisesToExerciseCardResume(data!);
  }

  return { exercisesResume, error };
};

const useFetchExerciseDetails = async (exerciseId: number) => {
  const { execute } = useCRUD(() =>
    workoutExerciseRepo.getExerciseDetails(exerciseId)
  );

  const { data, error } = await execute();

  let exerciseDetails = null;

  if (!error) {
    exerciseDetails = mapExerciseDataToExerciseDetails(data!);
  }

  return { exerciseDetails, error };
};

export { useFetchExercisesList, useFetchExerciseDetails };
