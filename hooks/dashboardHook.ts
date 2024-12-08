import { supabase } from '@/api/supabaseClient';

const useFetchDashboardWorkouts = async () => {
  try {
    const { data, error } = await supabase.rpc('get_dashboard_details');

    if (error) {
      console.error('Error fetching dashboard workouts:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    return { data: null, error };
  }
};

export { useFetchDashboardWorkouts };
