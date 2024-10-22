import { supabase } from '@/api/supabaseClient';
import { WorkoutExerciseRepository } from '@/repositories/workoutExerciseRepository';
import useCRUD from './useCRUD';
import { mapWorkoutExerciseDBToDetails } from '@/mappers/mapWorkoutsDataToDetailsWorkout';

const workoutRepository = new WorkoutExerciseRepository(supabase);

const useFetchDetailsWorkout = async (templateId: number) => {
  const { execute } = useCRUD(() =>
    workoutRepository.getDetailsWorkoutWithExercises(templateId)
  );

  const { data, error } = await execute();

  let myRoutineResume = null;
  if (!error) {
    myRoutineResume = mapWorkoutExerciseDBToDetails(data!);
  }

  return { myRoutineResume, error };
};

export { useFetchDetailsWorkout };
