import supabaseClient from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';

const useFetchDetailsLastWorkout = async (templateId: number) => {
  const { execute } = useCRUD(() =>
    supabaseClient.get('/rpc/get_last_workout_details', {
      params: {
        templ_id: templateId,
      },
    })
  );

  const { data, error } = await execute();

  return { data, error };
};

const useFetchDetailsWorkout = async (id: number) => {
  const { execute } = useCRUD(() =>
    supabaseClient.get('/rpc/get_workout_details', {
      params: {
        w_id: id,
      },
    })
  );

  const { data, error } = await execute();

  return { data, error };
};

const useCreateWorkout = async (
  templateId: number,
  duration: number,
  exercises: ExerciseResume[]
) => {
  const totalVolume = exercises.reduce((acc, exercise) => {
    const exerciseVolume = exercise.sets!.reduce((setAcc, set) => {
      return setAcc + set.reps * set.weight;
    }, 0);
    return acc + exerciseVolume;
  }, 0);

  const { execute: executeWorkoutInsert } = useCRUD(() =>
    supabaseClient.post('/workouts', {
      template_id: templateId,
      volume: totalVolume,
      duration: duration,
      template: false,
    })
  );

  const { data: dataWorkoutInsert, error: errorWorkoutInsert } =
    await executeWorkoutInsert();

  if (errorWorkoutInsert) {
    return { error: errorWorkoutInsert };
  }

  for (const exercise of exercises) {
    if (exercise.sets!.length > 0) {
      for (const set of exercise.sets!) {
        const { execute: executeWorkoutExerciseInsert } = useCRUD(() =>
          supabaseClient.post('/workout_exercises', {
            workout_id: dataWorkoutInsert[0].id,
            exercise_id: exercise.id,
            sets: 1,
            reps: set.reps,
            weight: set.weight,
            notes: exercise.notes,
            rest_time: exercise.restTime === '0' ? null : exercise.restTime,
          })
        );

        const { error: errorWorkoutExerciseInsert } =
          await executeWorkoutExerciseInsert();

        if (errorWorkoutExerciseInsert) {
          return { error: errorWorkoutExerciseInsert };
        }
      }
    } else {
      const { execute: executeWorkoutExerciseInsert } = useCRUD(() =>
        supabaseClient.post('/workout_exercises', {
          workout_id: dataWorkoutInsert[0].id,
          exercise_id: exercise.id,
          notes: exercise.notes,
          rest_time: exercise.restTime,
        })
      );

      const { error: errorWorkoutExerciseInsert } =
        await executeWorkoutExerciseInsert();

      if (errorWorkoutExerciseInsert) {
        return { error: errorWorkoutExerciseInsert };
      }
    }
  }

  return { error: null };
};

const useFetchRoutineWorkouts = async (id: number) => {
  const { execute } = useCRUD(() =>
    supabaseClient.get('/rpc/get_routine_chart_data', {
      params: {
        templ_id: id,
      },
    })
  );

  const { data, error } = await execute();

  return { data, error };
};

export {
  useFetchDetailsLastWorkout,
  useFetchDetailsWorkout,
  useCreateWorkout,
  useFetchRoutineWorkouts,
};
