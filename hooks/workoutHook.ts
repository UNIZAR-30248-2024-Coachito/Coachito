import { supabase } from '@/api/supabaseClient';
import {
  WorkoutInsert,
  WorkoutRepository,
} from '@/repositories/workoutRepository';
import useCRUD from './useCRUD';
import { mapWorkoutDataToDetailsRoutineResume } from '@/mappers/mapWorkoutDataToDetailsRoutinesResume';
import { ExerciseResume } from '@/components/detailsRoutine/ExerciseResume';
import {
  WorkoutExerciseInsert,
  WorkoutExerciseRepository,
} from '@/repositories/workoutExerciseRepository';

const workoutRepository = new WorkoutRepository(supabase);
const workoutExercisesRepo = new WorkoutExerciseRepository(supabase);

const useFetchDetailsWorkout = async (templateId: number) => {
  const { execute } = useCRUD(() =>
    workoutRepository.getDetailsWorkout(templateId)
  );

  const { data, error } = await execute();

  let myRoutineResume = null;
  if (!error) {
    myRoutineResume = mapWorkoutDataToDetailsRoutineResume(data!);
  }

  return { myRoutineResume, error };
};

const useCreateWorkout = async (
  templateId: number,
  duration: number,
  exercises: ExerciseResume[]
) => {
  const newWorkoutEntity = {
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

  return { error: null };
};

export { useFetchDetailsWorkout, useCreateWorkout };
