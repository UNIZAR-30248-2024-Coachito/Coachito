import { supabase } from '@/api/supabaseClient';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import useCRUD from './useCRUD';
import { mapWorkoutDataToGroupedRoutinesResume } from '@/mappers/mapWorkoutDataToGroupedRoutinesResume';
import { WorkoutTemplateRepository } from '@/repositories/workoutTemplateRepository';

const workoutRepository = new WorkoutRepository(supabase);
const workoutTemplateRepository = new WorkoutTemplateRepository(supabase);

const useFetchWorkoutTemplateById = (id: number) => {
  const { execute, ...rest } = useCRUD(() =>
    workoutTemplateRepository.getById(id)
  );
  return { execute, ...rest };
};

const useDeleteWorkoutTemplate = async (id: number) => {
  const { execute } = useCRUD(() => workoutTemplateRepository.delete(id));

  const { data, error } = await execute();

  return { data, error };
};

const useFetchTemplateWorkouts = async () => {
  const { execute } = useCRUD(() =>
    workoutRepository.getWorkoutsWithExercises(true)
  );

  const { data, error } = await execute();

  let myRoutineResume = null;

  if (!error) {
    myRoutineResume = mapWorkoutDataToGroupedRoutinesResume(data!);
  }

  return { myRoutineResume, error };
};

export {
  useFetchWorkoutTemplateById,
  useDeleteWorkoutTemplate,
  useFetchTemplateWorkouts,
};
