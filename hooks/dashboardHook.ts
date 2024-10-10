import { supabase } from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import { mapWorkoutDataToCardResume } from '@/mappers/mapWorkoutDataToCardResume';

const workoutRepository = new WorkoutRepository(supabase);

const useFetchDashboardWorkouts = () => {
  const { data, loading, error } = useCRUD(() =>
    workoutRepository.getWorkoutsWithExercises()
  );
  let workoutResumes = null;

  if (!loading && !error) {
    workoutResumes = mapWorkoutDataToCardResume(data!);
  }

  return { workoutResumes, loading, error };
};
export { useFetchDashboardWorkouts };
