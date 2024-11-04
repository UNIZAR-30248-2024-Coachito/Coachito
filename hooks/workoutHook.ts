import supabaseClient from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { ExerciseResume } from '@/components/routine/ExerciseResume';

const useFetchDetailsLastWorkout = async (templateId: number) => {
  /*const { execute } = useCRUD(() =>
    workoutRepository.getDetailsLastWorkout(templateId)
  );

  const { data, error } = await execute();

  let exercisesResumes = null;
  if (!error) {
    exercisesResumes = mapWorkoutDataToExerciseResumeArray(data!);
  }

  return { exercisesResumes, error };*/
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
  /*const newWorkoutEntity = {
    id: undefined,
    template_id: templateId,
    template: false,
    duration: duration,
  } as WorkoutInsert;

  const { execute: executeWorkoutInsert } = useCRUD(() =>
    workoutRepository.create(newWorkoutEntity)
  );

  const { data: dataWorkoutInsert, error: errorWorkoutInsert } =
    await executeWorkoutInsert();

  if (errorWorkoutInsert) {
    return { error: errorWorkoutInsert };
  }

  for (const exercise of exercises) {
    const newWorkoutExerciseEntity = {
      id: undefined,
      workout_id: dataWorkoutInsert?.id,
      exercise_id: exercise.id,
      notes: exercise.notes,
      rest_time: exercise.restTime,
    } as WorkoutExerciseInsert;

    if (exercise.sets.length > 0) {
      for (const set of exercise.sets) {
        newWorkoutExerciseEntity.reps = set.reps;
        newWorkoutExerciseEntity.sets = 1;
        newWorkoutExerciseEntity.weight = set.weight;

        const { execute: executeWorkoutExerciseInsert } = useCRUD(() =>
          workoutExercisesRepo.create(newWorkoutExerciseEntity)
        );

        const { error: errorWorkoutExerciseInsert } =
          await executeWorkoutExerciseInsert();

        if (errorWorkoutExerciseInsert) {
          return { error: errorWorkoutExerciseInsert };
        }
      }
    } else {
      const { execute: executeWorkoutExerciseInsert } = useCRUD(() =>
        workoutExercisesRepo.create(newWorkoutExerciseEntity)
      );

      const { error: errorWorkoutExerciseInsert } =
        await executeWorkoutExerciseInsert();

      if (errorWorkoutExerciseInsert) {
        return { error: errorWorkoutExerciseInsert };
      }
    }
  }

  return { error: null };*/
};

const useFetchRoutineWorkouts = async (id: number) => {
  /*const { execute } = useCRUD(() => workoutRepository.getRoutineWorkouts(id));

  const { data, error } = await execute();

  let chartDetailsWorkout = null;
  if (!error) {
    chartDetailsWorkout = mapWorkoutDataToRoutineChart(data!);
  }

  return { chartDetailsWorkout, error };*/
};

export {
  useFetchDetailsLastWorkout,
  useFetchDetailsWorkout,
  useCreateWorkout,
  useFetchRoutineWorkouts,
};
