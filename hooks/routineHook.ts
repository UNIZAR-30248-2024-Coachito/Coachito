import { supabase } from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import {
  WorkoutTemplateInsert,
  WorkoutTemplateUpdate,
} from '@/repositories/workoutTemplateRepository';
import { WorkoutTemplateRepository } from '@/repositories/workoutTemplateRepository';
import {
  WorkoutInsert,
  WorkoutRepository,
} from '@/repositories/workoutRepository';
import {
  WorkoutExerciseInsert,
  WorkoutExerciseRepository,
} from '@/repositories/workoutExerciseRepository';
import { ExerciseResume } from '@/components/routine/ExerciseResume';

const workoutTemplateRepo = new WorkoutTemplateRepository(supabase);
const workoutsRepo = new WorkoutRepository(supabase);
const workoutExercisesRepo = new WorkoutExerciseRepository(supabase);

const useCreateRoutine = async (
  name: string,
  exercises: ExerciseResume[],
  groupId: number
) => {
  const newWorkoutTemplateEntity = {
    id: undefined,
    name: name,
    deleted: false,
    user_id: 1,
    group_id: groupId === 0 ? null : groupId,
  } as WorkoutTemplateInsert;

  const { execute: executeWorkoutTemplateInsert } = useCRUD(() =>
    workoutTemplateRepo.create(newWorkoutTemplateEntity)
  );

  const { data: dataWorkoutTemplateInsert, error: errorWorkoutTemplateInsert } =
    await executeWorkoutTemplateInsert();

  if (errorWorkoutTemplateInsert) {
    return { error: errorWorkoutTemplateInsert };
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
    return { errorWorkoutsInsert };
  }

  for (const exercise of exercises) {
    const newWorkoutExerciseEntity = {
      id: undefined,
      workout_id: dataWorkoutsInsert?.id,
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

const useUpdateRoutine = async (
  templateId: number,
  name: string,
  exercises: ExerciseResume[]
) => {
  const workoutTemplateEntity = {
    id: undefined,
    name: name,
    deleted: false,
    user_id: 1,
  } as WorkoutTemplateUpdate;

  const { execute: executeWorkoutTemplateUpdate } = useCRUD(() =>
    workoutTemplateRepo.update(templateId, workoutTemplateEntity)
  );

  const { error: errorWorkoutTemplateUpdate } =
    await executeWorkoutTemplateUpdate();

  if (errorWorkoutTemplateUpdate) {
    return { error: errorWorkoutTemplateUpdate };
  }

  const newWorkoutsEntity = {
    id: undefined,
    template_id: templateId,
    template: true,
  } as WorkoutInsert;

  const { execute: executeWorkoutsInsert } = useCRUD(() =>
    workoutsRepo.create(newWorkoutsEntity)
  );

  const { data: dataWorkoutsInsert, error: errorWorkoutsInsert } =
    await executeWorkoutsInsert();

  if (errorWorkoutsInsert) {
    return { errorWorkoutsInsert };
  }

  for (const exercise of exercises) {
    const newWorkoutExerciseEntity = {
      id: undefined,
      workout_id: dataWorkoutsInsert?.id,
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

export { useCreateRoutine, useUpdateRoutine };
