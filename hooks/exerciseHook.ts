import { supabase } from '@/api/supabaseClient';

const useFetchExercisesList = async () => {
  try {
    const { data, error } = await supabase.rpc('get_exercises_list');

    if (error) {
      console.error('Error fetching exercises list:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: unknown) {
    console.error('Unexpected error fetching exercises list:', error);
    return { data: null, error };
  }
};

const useFetchExerciseDetails = async (exerciseId: number) => {
  try {
    const { data, error } = await supabase.rpc('get_exercise_details', {
      ex_id: exerciseId,
    });

    if (error) {
      console.error('Error fetching exercise details:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: unknown) {
    console.error('Unexpected error fetching exercise details:', error);
    return { data: null, error };
  }
};

export { useFetchExercisesList, useFetchExerciseDetails };
