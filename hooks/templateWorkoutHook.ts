import { supabase } from '@/api/supabaseClient';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import useCRUD from './useCRUD';
import { mapWorkoutDataToGroupedRoutinesResume } from '@/mappers/mapWorkoutDataToGroupedRoutinesResume';
import { WorkoutTemplateRepository } from '@/repositories/workoutTemplateRepository';
import { WorkoutTemplateGroupRepository } from '@/repositories/workoutTemplateGroupRepository';
import { useEffect } from 'react';

const workoutRepository = new WorkoutRepository(supabase);
const workoutTemplateRepository = new WorkoutTemplateRepository(supabase);
const workoutTemplateGroupRepository = new WorkoutTemplateGroupRepository(
  supabase
);

const useDeleteTemplateWorkoutById = (id: number) => {
  const { execute, ...rest } = useCRUD(() =>
    workoutTemplateRepository.delete(id)
  );
  return { execute, ...rest };
};

const useDeleteTemplateWorkoutGroupById = (id: number) => {
  const { execute, ...rest } = useCRUD(() =>
    workoutTemplateGroupRepository.delete(id)
  );
  return { execute, ...rest };
};

const useFetchTemplateWorkouts = () => {
  const { data, loading, error, execute } = useCRUD(() =>
    workoutRepository.getTemplateWorkoutsWithExercises()
  );

  useEffect(() => {
    execute();
  }, []);

  let myRoutineResume = null;

  if (!loading && !error) {
    myRoutineResume = mapWorkoutDataToGroupedRoutinesResume(data!);
  }

  return { myRoutineResume, loading, error };
};

export {
  useDeleteTemplateWorkoutById,
  useDeleteTemplateWorkoutGroupById,
  useFetchTemplateWorkouts,
};
