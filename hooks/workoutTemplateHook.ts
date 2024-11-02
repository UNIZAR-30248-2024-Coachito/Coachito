import supabaseClient from '@/api/supabaseClient';
import useCRUD from './useCRUD';

const useDeleteWorkoutTemplate = async (id: number) => {
  /*const { execute } = useCRUD(() => workoutTemplateRepository.delete(id));

  const { data, error } = await execute();

  return { data, error };*/
};

const useFetchTemplateWorkouts = async () => {
  const { execute } = useCRUD(() =>
    supabaseClient.get('/rpc/get_routines_details')
  );

  const { data, error } = await execute();
  console.log(data);

  return { data, error };
};

export { useDeleteWorkoutTemplate, useFetchTemplateWorkouts };
