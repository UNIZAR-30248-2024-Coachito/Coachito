import { supabase } from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import {
  WorkoutTemplateGroupRepository,
  WorkoutTemplateGroupInsert,
} from '@/repositories/workoutTemplateGroupRepository';

const workoutTemplateGroupRepository = new WorkoutTemplateGroupRepository(
  supabase
);

const useCreateTemplateWorkoutGroup = (
  newEntity: WorkoutTemplateGroupInsert
) => {
  const { execute, ...rest } = useCRUD(() =>
    workoutTemplateGroupRepository.create(newEntity)
  );
  return { execute, ...rest };
};

const useDeleteTemplateWorkoutGroupById = (id: number) => {
  const { execute, ...rest } = useCRUD(() =>
    workoutTemplateGroupRepository.delete(id)
  );
  return { execute, ...rest };
};

export { useCreateTemplateWorkoutGroup, useDeleteTemplateWorkoutGroupById };
