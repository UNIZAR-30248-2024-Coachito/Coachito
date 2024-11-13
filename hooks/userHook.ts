import supabaseClient from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { UserWorkoutsDetails } from '@/screens/Profile';

const useFetchUserWorkouts = async (userId: number) => {
  const { execute } = useCRUD<UserWorkoutsDetails>(() =>
    supabaseClient.get('/rpc/get_user_workouts', {
      params: {
        user_id: userId,
      },
    })
  );

  const { data, error } = await execute();

  return { data, error };
};

export { useFetchUserWorkouts };
