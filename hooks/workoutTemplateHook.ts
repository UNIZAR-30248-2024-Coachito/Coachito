import supabaseClient from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';

const useDeleteWorkoutTemplate = async (id: number) => {
  const { execute } = useCRUD(() =>
    supabaseClient.patch(
      '/workout_templates',
      {
        deleted: true,
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

const useFetchTemplateWorkouts = async () => {
  const { execute } = useCRUD(() =>
    supabaseClient.get('/rpc/get_routines_details')
  );

  const { data, error } = await execute();

  return { data, error };
};

const useCreateRoutine = async (
  name: string,
  exercises: ExerciseResume[],
  groupId: number
) => {
  const { execute: executeWorkoutTemplateInsert } = useCRUD(() =>
    supabaseClient.post('/workout_templates', {
      name: name,
      user_id: 1,
      group_id: groupId === 0 ? null : groupId,
      deleted: false,
    })
  );

  const { data: dataWorkoutTemplateInsert, error: errorWorkoutTemplateInsert } =
    await executeWorkoutTemplateInsert();

  if (errorWorkoutTemplateInsert) {
    return { error: errorWorkoutTemplateInsert };
  }

  const { execute: executeWorkoutsInsert } = useCRUD(() =>
    supabaseClient.post('/workouts', {
      template_id: dataWorkoutTemplateInsert[0].id,
      template: true,
    })
  );

  const { data: dataWorkoutsInsert, error: errorWorkoutsInsert } =
    await executeWorkoutsInsert();

  if (errorWorkoutsInsert) {
    return { error: errorWorkoutsInsert };
  }

  for (const exercise of exercises) {
    if (exercise.sets!.length > 0) {
      for (const set of exercise.sets!) {
        const newWorkoutExerciseEntity = {
          workout_id: dataWorkoutsInsert[0].id,
          exercise_id: exercise.id,
          sets: 1,
          reps: set.reps === 0 ? null : set.reps,
          weight: set.weight === 0 ? null : set.weight,
          notes: exercise.notes,
          rest_time: exercise.restTime === '0' ? null : exercise.restTime,
          target_number_reps: exercise.targetReps,
        };

        const { execute: executeWorkoutExerciseInsert } = useCRUD(() =>
          supabaseClient.post('/workout_exercises', newWorkoutExerciseEntity)
        );

        const { error: errorWorkoutExerciseInsert } =
          await executeWorkoutExerciseInsert();

        if (errorWorkoutExerciseInsert) {
          return { error: errorWorkoutExerciseInsert };
        }
      }
      console.log('Numero de reps target: ', exercise.targetReps);
    } else {
      const newWorkoutExerciseEntity = {
        workout_id: dataWorkoutsInsert[0].id,
        exercise_id: exercise.id,
        notes: exercise.notes,
        rest_time: exercise.restTime,
      };

      const { execute: executeWorkoutExerciseInsert } = useCRUD(() =>
        supabaseClient.post('/workout_exercises', newWorkoutExerciseEntity)
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

const useUpdateRoutine = async (
  templateId: number,
  name: string,
  exercises: ExerciseResume[]
) => {
  const { execute: executeWorkoutTemplateInsert } = useCRUD(() =>
    supabaseClient.patch(
      '/workout_templates',
      {
        name: name,
      },
      {
        params: {
          id: `eq.${templateId}`,
        },
      }
    )
  );

  const { error: errorWorkoutTemplateUpdate } =
    await executeWorkoutTemplateInsert();

  if (errorWorkoutTemplateUpdate) {
    return { error: errorWorkoutTemplateUpdate };
  }

  const { execute: executeWorkoutsInsert } = useCRUD(() =>
    supabaseClient.post('/workouts', {
      template_id: templateId,
      template: true,
    })
  );

  const { data: dataWorkoutsUpdate, error: errorWorkoutsUpdate } =
    await executeWorkoutsInsert();

  if (errorWorkoutsUpdate) {
    return { error: errorWorkoutsUpdate };
  }

  for (const exercise of exercises) {
    if (exercise.sets!.length > 0) {
      for (const set of exercise.sets!) {
        const newWorkoutExerciseEntity = {
          workout_id: dataWorkoutsUpdate[0].id,
          exercise_id: exercise.id,
          sets: 1,
          reps: set.reps === 0 ? null : set.reps,
          weight: set.weight === 0 ? null : set.weight,
          notes: exercise.notes,
          rest_time: exercise.restTime === '0' ? null : exercise.restTime,
        };

        const { execute: executeWorkoutExerciseInsert } = useCRUD(() =>
          supabaseClient.post('/workout_exercises', newWorkoutExerciseEntity)
        );

        const { error: errorWorkoutExerciseInsert } =
          await executeWorkoutExerciseInsert();

        if (errorWorkoutExerciseInsert) {
          return { error: errorWorkoutExerciseInsert };
        }
      }
    } else {
      const newWorkoutExerciseEntity = {
        workout_id: dataWorkoutsUpdate[0].id,
        exercise_id: exercise.id,
        notes: exercise.notes,
        rest_time: exercise.restTime,
      };

      const { execute: executeWorkoutExerciseInsert } = useCRUD(() =>
        supabaseClient.post('/workout_exercises', newWorkoutExerciseEntity)
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

const useRoutineTitleExists = async (title: string, groupId: number) => {
  const { execute } = useCRUD(() =>
    supabaseClient.get('/rpc/routine_title_exists', {
      params: {
        routine_title: title,
        folder_id: groupId,
      },
    })
  );

  const { data, error } = await execute();

  return { data, error };
};

export {
  useDeleteWorkoutTemplate,
  useFetchTemplateWorkouts,
  useCreateRoutine,
  useUpdateRoutine,
  useRoutineTitleExists,
};
