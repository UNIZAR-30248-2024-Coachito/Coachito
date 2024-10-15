import { supabase } from '@/api/supabaseClient';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import useCRUD from './useCRUD';
import { mapWorkoutDataToGroupedRoutinesResume } from '@/mappers/mapWorkoutDataToGroupedRoutinesResume';
import {
  WorkoutTemplateRepository,
  WorkoutTemplateUpdate,
} from '@/repositories/workoutTemplateRepository';
import { useEffect } from 'react';

const workoutRepository = new WorkoutRepository(supabase);
const workoutTemplateRepository = new WorkoutTemplateRepository(supabase);

const useFetchWorkoutTemplateById = (id: number) => {
  const { execute, ...rest } = useCRUD(() =>
    workoutTemplateRepository.getById(id)
  );
  return { execute, ...rest };
};

const useUpdateWorkoutTemplate = (entity: WorkoutTemplateUpdate) => {
  const { execute, ...rest } = useCRUD(() =>
    workoutTemplateRepository.update(entity.id!, entity)
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
  useFetchWorkoutTemplateById,
  useUpdateWorkoutTemplate,
  useFetchTemplateWorkouts,
};
