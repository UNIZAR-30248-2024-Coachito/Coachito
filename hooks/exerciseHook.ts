import supabaseClient from '@/api/supabaseClient';
import useCRUD from './useCRUD';

const useFetchExercisesList = async () => {
  const { execute } = useCRUD(() =>
    supabaseClient.get('/rpc/get_exercises_list')
  );

  const { data, error } = await execute();

  return { data, error };
};

const useFetchExerciseDetails = async (exerciseId: number) => {
  const { execute } = useCRUD(() =>
    supabaseClient.get('/rpc/get_exercise_details', {
      params: {
        ex_id: exerciseId,
      },
    })
  );

  const { data, error } = await execute();

  return { data, error };
};

export { useFetchExercisesList, useFetchExerciseDetails };
