import supabaseClient from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { UserWorkoutsDetails } from '@/screens/Profile';

const useFetchUserWorkouts = async (userId: string) => {
  const { execute } = useCRUD<UserWorkoutsDetails>(() =>
    supabaseClient.get('/rpc/get_user_workouts', {
      params: {
        uid: userId,
      },
    })
  );

  const { data, error } = await execute();

  return { data, error };
};

export { useFetchUserWorkouts };
