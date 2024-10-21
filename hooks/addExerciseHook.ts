import { supabase } from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { ExerciseRepository } from '@/repositories/exerciseRepository';
import { mapExercisesToExerciseCardResume } from '@/mappers/mapExerciseDataToCardResume';
import { WorkoutTemplateInsert } from '@/repositories/workoutTemplateRepository';
import { WorkoutTemplateRepository } from '@/repositories/workoutTemplateRepository';
import {
  WorkoutInsert,
  WorkoutRepository,
} from '@/repositories/workoutRepository';
import {
  WorkoutExerciseInsert,
  WorkoutExerciseRepository,
} from '@/repositories/workoutExerciseRepository';

const exerciseRepo = new ExerciseRepository(supabase);
const workoutTemplateRepo = new WorkoutTemplateRepository(supabase);
const workoutsRepo = new WorkoutRepository(supabase);
const workoutExercisesRepo = new WorkoutExerciseRepository(supabase);

const useFetchExercisesList = async () => {
  const { execute } = useCRUD(() => exerciseRepo.getExercisesListData());

  const { data, error } = await execute();

  let exercisesResume = null;

  if (!error) {
    exercisesResume = mapExercisesToExerciseCardResume(data!);
  }

  return { exercisesResume, error };
};

const useCreateRoutine = async (name: string, exercises: number[]) => {
  const newWorkoutTemplateEntity = {
    id: undefined,
    name: name,
    deleted: false,
    user_id: 1,
  } as WorkoutTemplateInsert;

  const { execute: executeWorkoutTemplateInsert } = useCRUD(() =>
    workoutTemplateRepo.create(newWorkoutTemplateEntity)
  );

  const { data: dataWorkoutTemplateInsert, error: errorWorkoutTemplateInsert } =
    await executeWorkoutTemplateInsert();

  if (errorWorkoutTemplateInsert) {
    return { data: '', errorWorkoutTemplateInsert };
  }

  const newWorkoutsEntity = {
    id: undefined,
    template_id: dataWorkoutTemplateInsert?.id,
    template: true,
  } as WorkoutInsert;

  const { execute: executeWorkoutsInsert } = useCRUD(() =>
    workoutsRepo.create(newWorkoutsEntity)
  );

  const { data: dataWorkoutsInsert, error: errorWorkoutsInsert } =
    await executeWorkoutsInsert();

  if (errorWorkoutsInsert) {
    return { data: '', errorWorkoutsInsert };
  }

  for (const id of exercises) {
    const newWorkoutExerciseEntity = {
      id: undefined,
      workout_id: dataWorkoutsInsert?.id,
      exercise_id: id,
    } as WorkoutExerciseInsert;

    const { execute: executeWorkoutExerciseInsert } = useCRUD(() =>
      workoutExercisesRepo.create(newWorkoutExerciseEntity)
    );

    const { error: errorWorkoutExerciseInsert } =
      await executeWorkoutExerciseInsert();

    if (errorWorkoutExerciseInsert) {
      return { data: '', error: errorWorkoutExerciseInsert };
    }
  }

  return { error: null };
};

export { useFetchExercisesList, useCreateRoutine };
