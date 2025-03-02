import { supabase } from '@/api/supabaseClient';

const useFetchUserWorkouts = async () => {
  try {
    const { data, error } = await supabase.rpc('get_user_workouts');

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
