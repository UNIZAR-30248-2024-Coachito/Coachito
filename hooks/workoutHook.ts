import { supabase } from '@/api/supabaseClient';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import useCRUD from './useCRUD';
import { mapWorkoutDataToExerciseResumeArray } from '@/mappers/mapWorkoutDataToDetailsRoutinesResume';
import { mapWorkoutDataToWorkoutResume } from '@/mappers/mapWorkoutDataToWorkoutResume';

const workoutRepository = new WorkoutRepository(supabase);

const useFetchDetailsLastWorkout = async (templateId: number) => {
  const { execute } = useCRUD(() =>
    workoutRepository.getDetailsLastWorkout(templateId)
  );

  const { data, error } = await execute();

  let exercisesResumes = null;
  if (!error) {
    exercisesResumes = mapWorkoutDataToExerciseResumeArray(data!);
  }

  return { exercisesResumes, error };
};

const useFetchDetailsWorkout = async (id: number) => {
  const { execute } = useCRUD(() => workoutRepository.getDetailsWorkout(id));

  const { data, error } = await execute();

  let exercisesResumes = null;
  if (!error) {
    exercisesResumes = mapWorkoutDataToWorkoutResume(data!);
  }

  return { exercisesResumes, error };
};

export { useFetchDetailsLastWorkout, useFetchDetailsWorkout };
