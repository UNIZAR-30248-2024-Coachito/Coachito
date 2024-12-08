import { supabase } from '@/api/supabaseClient';

const useFetchUserWorkouts = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_user_workouts', {
      uid: userId, // Supabase RPC expects named arguments in an object
    });

    if (error) {
      console.error('Error fetching user workouts:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: unknown) {
    console.error('Unexpected error fetching user workouts:', error);
    return { data: null, error };
  }
};

export { useFetchUserWorkouts };
