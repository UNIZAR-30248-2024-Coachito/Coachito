import { supabase } from '@/api/supabaseClient';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';

const useDeleteWorkoutTemplate = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('workout_templates')
      .update({ deleted: true })
      .eq('id', id);

    return { data, error };
  } catch (error) {
    console.error('Error deleting workout template:', error);
    return { data: null, error };
  }
};

const useFetchTemplateWorkouts = async () => {
  try {
    const { data, error } = await supabase.rpc('get_routines_details');
    return { data, error };
  } catch (error) {
    console.error('Error fetching template workouts:', error);
    return { data: null, error };
  }
};

const useCreateRoutine = async (
  name: string,
  exercises: ExerciseResume[],
  groupId: number,
  user_id: string
) => {
  try {
    const { data: workoutTemplate, error: workoutTemplateError } =
      await supabase
        .from('workout_templates')
        .insert({
          name,
          user_id,
          group_id: groupId === 0 ? null : groupId,
          deleted: false,
        })
        .select();

    if (workoutTemplateError) return { error: workoutTemplateError };

    const templateId = workoutTemplate[0].id;

    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        template_id: templateId,
        template: true,
      })
      .select();

    if (workoutError) return { error: workoutError };

    const workoutId = workout[0].id;

    for (const exercise of exercises) {
      if (exercise.sets!.length > 0) {
        for (const set of exercise.sets!) {
          const workoutExercise = {
            workout_id: workoutId,
            exercise_id: exercise.id,
            sets: 1,
            reps: set.reps === 0 ? null : set.reps,
            weight: set.weight === 0 ? null : set.weight,
            notes: exercise.notes,
            rest_time: exercise.restTime === '0' ? null : exercise.restTime,
            target_number_reps: exercise.targetReps,
          };

          const { error: workoutExerciseError } = await supabase
            .from('workout_exercises')
            .insert(workoutExercise);

          if (workoutExerciseError) return { error: workoutExerciseError };
        }
      } else {
        const workoutExercise = {
          workout_id: workoutId,
          exercise_id: exercise.id,
          notes: exercise.notes,
          rest_time: exercise.restTime,
        };

        const { error: workoutExerciseError } = await supabase
          .from('workout_exercises')
          .insert(workoutExercise);

        if (workoutExerciseError) return { error: workoutExerciseError };
      }
    }

    return { error: null };
  } catch (error) {
    console.error('Error creating routine:', error);
    return { error };
  }
};

const useUpdateRoutine = async (
  templateId: number,
  name: string,
  exercises: ExerciseResume[]
) => {
  try {
    const { error: updateTemplateError } = await supabase
      .from('workout_templates')
      .update({ name })
      .eq('id', templateId);

    if (updateTemplateError) return { error: updateTemplateError };

    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        template_id: templateId,
        template: true,
      })
      .select();

    if (workoutError) return { error: workoutError };

    const workoutId = workout[0].id;

    for (const exercise of exercises) {
      if (exercise.sets!.length > 0) {
        for (const set of exercise.sets!) {
          const workoutExercise = {
            workout_id: workoutId,
            exercise_id: exercise.id,
            sets: 1,
            reps: set.reps === 0 ? null : set.reps,
            weight: set.weight === 0 ? null : set.weight,
            notes: exercise.notes,
            rest_time: exercise.restTime === '0' ? null : exercise.restTime,
          };

          const { error: workoutExerciseError } = await supabase
            .from('workout_exercises')
            .insert(workoutExercise);

          if (workoutExerciseError) return { error: workoutExerciseError };
        }
      } else {
        const workoutExercise = {
          workout_id: workoutId,
          exercise_id: exercise.id,
          notes: exercise.notes,
          rest_time: exercise.restTime,
        };

        const { error: workoutExerciseError } = await supabase
          .from('workout_exercises')
          .insert(workoutExercise);

        if (workoutExerciseError) return { error: workoutExerciseError };
      }
    }

    return { error: null };
  } catch (error) {
    console.error('Error updating routine:', error);
    return { error };
  }
};

const useRoutineTitleExists = async (title: string, groupId: number) => {
  try {
    const { data, error } = await supabase.rpc('routine_title_exists', {
      routine_title: title,
      folder_id: groupId,
    });

    return { data, error };
  } catch (error) {
    console.error('Error checking routine title:', error);
    return { data: null, error };
  }
};

export {
  useDeleteWorkoutTemplate,
  useFetchTemplateWorkouts,
  useCreateRoutine,
  useUpdateRoutine,
  useRoutineTitleExists,
};
