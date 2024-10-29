import { supabase } from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import { mapWorkoutDataToProfileresume } from '@/mappers/mapWorkoutDataToProfileResume';

const workoutRepo = new WorkoutRepository(supabase);

const useFetchUserWorkouts = async (userId: number) => {
  const { execute } = useCRUD(() => workoutRepo.getUserWorkouts(userId));

  const { data, error } = await execute();

  let userWorkouts = null;

  if (!error) {
    userWorkouts = mapWorkoutDataToProfileresume(data!);
  }

  return { userWorkouts, error };
};

export { useFetchUserWorkouts };
