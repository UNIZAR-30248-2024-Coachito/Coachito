import supabaseClient from '@/api/supabaseClient';
import useCRUD from './useCRUD';

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
  useCreateTemplateWorkoutGroup,
  useEditTemplateWorkoutGroup,
  useDeleteTemplateWorkoutGroupById,
};
