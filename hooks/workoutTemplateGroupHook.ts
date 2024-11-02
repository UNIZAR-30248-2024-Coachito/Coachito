import supabaseClient from '@/api/supabaseClient';
import useCRUD from './useCRUD';

const useFetchTemplateWorkoutGroups = async () => {
  const { execute } = useCRUD(() =>
    supabaseClient.get('/rpc/get_template_workout_groups')
  );

  const { data, error } = await execute();
  console.log(data);

  return { data, error };
};

const useCreateTemplateWorkoutGroup = async (name: string) => {
  const { execute } = useCRUD(() =>
    supabaseClient.post('/workout_templates_group', {
      name: name,
    })
  );

  const { data, error } = await execute();

  return { data, error };
};

const useEditTemplateWorkoutGroup = async (id: number, name: string) => {
  const { execute } = useCRUD(() =>
    supabaseClient.patch(
      '/workout_templates_group',
      {
        name: name,
      },
      {
        params: {
          id: `eq.${id}`,
        },
      }
    )
  );

  const { data, error } = await execute();

  return { data, error };
};

const useDeleteTemplateWorkoutGroupById = async (id: number) => {
  const { execute } = useCRUD(() =>
    supabaseClient.delete('/workout_templates_group', {
      params: {
        id: `eq.${id}`,
      },
    })
  );

  const { data, error } = await execute();

  return { data, error };
};

export {
  useFetchTemplateWorkoutGroups,
  useCreateTemplateWorkoutGroup,
  useEditTemplateWorkoutGroup,
  useDeleteTemplateWorkoutGroupById,
};
