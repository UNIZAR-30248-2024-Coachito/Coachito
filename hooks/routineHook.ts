import { ExerciseResume } from '@/components/routine/ExerciseResume';

const useCreateRoutine = async (
  name: string,
  exercises: ExerciseResume[],
  groupId: number
) => {
  /*const newWorkoutTemplateEntity = {
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

  return { error: null };*/
};

const useUpdateRoutine = async (
  templateId: number,
  name: string,
  exercises: ExerciseResume[]
) => {
  /*const workoutTemplateEntity = {
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

  // Ahora creamos una nueva plantilla con los cambios aplicados
  const newWorkoutTemplateEntity = {
    id: undefined, // Un ID nuevo para la nueva rutina
    name: name, // El nuevo nombre
    deleted: false, // Esta plantilla no está eliminada
    user_id: 1, // ID del usuario, ajustar según tu lógica
  } as WorkoutTemplateInsert;

  const { execute: executeNewWorkoutTemplateInsert } = useCRUD(() =>
    workoutTemplateRepo.create(newWorkoutTemplateEntity)
  );

  const {
    data: dataNewWorkoutTemplateInsert,
    error: errorNewWorkoutTemplateInsert,
  } = await executeNewWorkoutTemplateInsert();

  if (errorNewWorkoutTemplateInsert) {
    return { error: errorNewWorkoutTemplateInsert };
  }

  // Ahora, creamos un nuevo workout asociado a la nueva plantilla
  const newWorkoutsEntity = {
    id: undefined, // Un ID nuevo para el nuevo workout
    template_id: dataNewWorkoutTemplateInsert?.id, // Usamos el ID de la nueva plantilla
    template: true, // Indica que es una plantilla
  } as WorkoutInsert;

  const { execute: executeWorkoutsInsert } = useCRUD(() =>
    workoutsRepo.create(newWorkoutsEntity)
  );

  const { data: dataWorkoutsInsert, error: errorWorkoutsInsert } =
    await executeWorkoutsInsert();

  if (errorWorkoutsInsert) {
    return { error: errorWorkoutsInsert };
  }

  // Ahora, agregamos los ejercicios a la nueva rutina
  for (const exercise of exercises) {
    const newWorkoutExerciseEntity = {
      id: undefined, // Un ID nuevo para el nuevo ejercicio
      workout_id: dataWorkoutsInsert?.id, // Usamos el ID del nuevo workout
      exercise_id: exercise.id, // ID del ejercicio existente
      notes: exercise.notes,
      rest_time: exercise.restTime,
    } as WorkoutExerciseInsert;

    // Agregamos sets si existen
    if (exercise.sets.length > 0) {
      for (const set of exercise.sets) {
        newWorkoutExerciseEntity.reps = set.reps; // Asignamos reps
        newWorkoutExerciseEntity.sets = 1; // Asignamos número de sets, ajusta si necesario
        newWorkoutExerciseEntity.weight = set.weight; // Asignamos peso

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
      // Si no hay sets, simplemente creamos el ejercicio
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

export { useCreateRoutine, useUpdateRoutine };
