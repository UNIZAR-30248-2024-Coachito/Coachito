import { supabase } from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import { mapWorkoutDataToCardResume } from '@/mappers/mapWorkoutDataToCardResume';

const workoutRepository = new WorkoutRepository(supabase);

const useFetchDashboardWorkouts = async () => {
  const { execute } = useCRUD(() =>
    workoutRepository.getWorkoutsWithExercises(false)
  );

  const { data, error } = await execute();

  let workoutResumes = null;
  if (!error) {
    workoutResumes = mapWorkoutDataToCardResume(data!);
  }

  return { workoutResumes, error };
};
export { useFetchDashboardWorkouts };
