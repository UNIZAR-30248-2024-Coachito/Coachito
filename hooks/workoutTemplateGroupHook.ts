import { supabase } from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import {
  WorkoutTemplateGroupRepository,
  WorkoutTemplateGroupInsert,
  WorkoutTemplateGroupUpdate,
} from '@/repositories/workoutTemplateGroupRepository';
import { mapWorkoutTemplateGroupRowsToGroups } from '@/mappers/mapWorkoutTemplateGroupRowsToGroups';

const workoutTemplateGroupRepository = new WorkoutTemplateGroupRepository(
  supabase
);

const useFetchTemplateWorkoutGroups = async () => {
  const { execute } = useCRUD(() => workoutTemplateGroupRepository.getAll());

  const { data, error } = await execute();

  let groups = null;

  if (!error) {
    groups = mapWorkoutTemplateGroupRowsToGroups(data!);
  }

  return { groups, error };
};

const useCreateTemplateWorkoutGroup = async (name: string) => {
  const newEntity = { id: undefined, name: name } as WorkoutTemplateGroupInsert;

  const { execute } = useCRUD(() =>
    workoutTemplateGroupRepository.create(newEntity)
  );

  const { data, error } = await execute();

  return { data, error };
};

const useEditTemplateWorkoutGroup = async (id: number, name: string) => {
  const updatedEntity = {
    name: name,
  } as unknown as WorkoutTemplateGroupUpdate;

  const { execute } = useCRUD(() =>
    workoutTemplateGroupRepository.update(id, updatedEntity)
  );

  const { data, error } = await execute();

  return { data, error };
};

const useDeleteTemplateWorkoutGroupById = async (id: number) => {
  const { execute } = useCRUD(() => workoutTemplateGroupRepository.delete(id));

  const { data, error } = await execute();
  
  return { data, error };
};

export {
  useFetchTemplateWorkoutGroups,
  useCreateTemplateWorkoutGroup,
  useEditTemplateWorkoutGroup,
  useDeleteTemplateWorkoutGroupById,
};
