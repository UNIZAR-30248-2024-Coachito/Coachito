import { supabase } from '@/api/supabaseClient';

const useFetchDashboardWorkouts = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_dashboard_details', {
    uid: userId,
  });

  if (error) {
    console.error('Error fetching dashboard data:', error);
    return { data: null, error };
  }

  return { data, error: null };
};

export { useFetchDashboardWorkouts };
