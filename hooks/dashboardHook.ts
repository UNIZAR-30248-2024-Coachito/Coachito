import supabaseClient from '@/api/supabaseClient';
import useCRUD from './useCRUD';

const useFetchDashboardWorkouts = async () => {
  const { execute } = useCRUD(() =>
    supabaseClient.get('/rpc/get_dashboard_details')
  );

  const { data, error } = await execute();

  return { data, error };
};

export { useFetchDashboardWorkouts };
