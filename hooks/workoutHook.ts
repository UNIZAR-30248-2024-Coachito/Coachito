import { supabase } from '@/api/supabaseClient';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import useCRUD from './useCRUD';
import { mapWorkoutDataToDetailsRoutineResume } from '@/mappers/mapWorkoutDataToDetailsRoutinesResume';

const workoutRepository = new WorkoutRepository(supabase);

const useFetchDetailsWorkout = async (templateId: number) => {
  const { execute } = useCRUD(() =>
    workoutRepository.getDetailsWorkout(templateId)
  );

  const { data, error } = await execute();

  let myRoutineResume = null;
  if (!error) {
    myRoutineResume = mapWorkoutDataToDetailsRoutineResume(data!);
  }

  return { myRoutineResume, error };
};

export { useFetchDetailsWorkout };
