import { supabase } from '@/api/supabaseClient';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import useCRUD from './useCRUD';
import { useEffect } from 'react';
import { mapWorkoutDataToDetailsRoutineResume } from '@/mappers/mapWorkoutDataToDetailsRoutinesResume';

const workoutRepository = new WorkoutRepository(supabase);

const useFetchDetailsWorkout = (templateId: number) => {
  const { data, loading, error, execute } = useCRUD(() =>
    workoutRepository.getDetailsWorkout(templateId)
  );

  useEffect(() => {
    execute();
  }, []);

  let myRoutineResume = null;

  if (!loading && !error) {
    myRoutineResume = mapWorkoutDataToDetailsRoutineResume(data!);
  }

  return { myRoutineResume, loading, error };
};

export { useFetchDetailsWorkout };
