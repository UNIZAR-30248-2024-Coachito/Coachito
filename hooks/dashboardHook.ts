import { supabase } from '@/api/supabaseClient';

const useFetchDashboardWorkouts = async () => {
  try {
    const { data, error } = await supabase.rpc('get_dashboard_details');
    return { data, error };
  } catch (error: unknown) {
    return { data: null, error };
  }
};

export { useFetchDashboardWorkouts };
