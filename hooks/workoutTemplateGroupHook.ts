import { supabase } from '@/api/supabaseClient';

const useCreateTemplateWorkoutGroup = async (name: string, user_id: string) => {
  try {
    const { data, error } = await supabase
      .from('workout_templates_group')
      .insert([{ name, user_id }]);

    return { data, error };
  } catch (error) {
    console.error('Error creating workout template group:', error);
    return { data: null, error };
  }
};

const useEditTemplateWorkoutGroup = async (id: number, name: string) => {
  try {
    const { data, error } = await supabase
      .from('workout_templates_group')
      .update({ name })
      .eq('id', id);

    return { data, error };
  } catch (error) {
    console.error('Error editing workout template group:', error);
    return { data: null, error };
  }
};

const useDeleteTemplateWorkoutGroupById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('workout_templates_group')
      .delete()
      .eq('id', id);

    return { data, error };
  } catch (error) {
    console.error('Error deleting workout template group:', error);
    return { data: null, error };
  }
};

export {
  useCreateTemplateWorkoutGroup,
  useEditTemplateWorkoutGroup,
  useDeleteTemplateWorkoutGroupById,
};
