import { supabase } from '@/api/supabaseClient';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import useCRUD from './useCRUD';
import { mapWorkoutDataToGroupedRoutinesResume } from '@/mappers/mapWorkoutDataToGroupedRoutinesResume';

const workoutRepository = new WorkoutRepository(supabase);

const useFetchMyRoutinesWorkouts = () => {
  const { data, loading, error } = useCRUD(() =>
    workoutRepository.getTemplateWorkoutsWithExercises()
  );
  let myRoutineResume = null;

  if (!loading && !error) {
    myRoutineResume = mapWorkoutDataToGroupedRoutinesResume(data!);
  }

  return { myRoutineResume, loading, error };
};

export { useFetchMyRoutinesWorkouts };
