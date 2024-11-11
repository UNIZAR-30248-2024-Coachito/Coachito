// functions.test.ts
import {
  useDeleteWorkoutTemplate,
  useFetchTemplateWorkouts,
  useCreateRoutine,
  useUpdateRoutine,
} from '@/hooks/workoutTemplateHook';
import supabaseClient from '@/api/supabaseClient';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';

jest.mock('@/api/supabaseClient');

describe('useDeleteWorkoutTemplate', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe marcar un template como eliminado exitosamente', async () => {
    // Preparación
    const id = 1;
    const mockData = { id, deleted: true };
    (supabaseClient.patch as jest.Mock).mockResolvedValue({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    // Ejecución
    const result = await useDeleteWorkoutTemplate(id);

    // Verificación
    expect(supabaseClient.patch).toHaveBeenCalledWith(
      '/workout_templates',
      { deleted: true },
      { params: { id: `eq.${id}` } }
    );
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando el patch falla', async () => {
    // Preparación
    const id = 1;
    const mockError = new Error('Error de red');
    (supabaseClient.patch as jest.Mock).mockRejectedValue(mockError);

    // Ejecución
    const result = await useDeleteWorkoutTemplate(id);

    // Verificación
    expect(supabaseClient.patch).toHaveBeenCalledWith(
      '/workout_templates',
      { deleted: true },
      { params: { id: `eq.${id}` } }
    );
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});

describe('useFetchTemplateWorkouts', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe obtener los templates de entrenamiento exitosamente', async () => {
    // Preparación
    const mockData = [{ id: 1, name: 'Rutina 1' }];
    (supabaseClient.get as jest.Mock).mockResolvedValue({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    // Ejecución
    const result = await useFetchTemplateWorkouts();

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_routines_details'
    );
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando la obtención falla', async () => {
    // Preparación
    const mockError = new Error('Error de red');
    (supabaseClient.get as jest.Mock).mockRejectedValue(mockError);

    // Ejecución
    const result = await useFetchTemplateWorkouts();

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_routines_details'
    );
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});

describe('useCreateRoutine', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe crear una rutina y sus ejercicios asociados exitosamente', async () => {
    // Preparación
    const name = 'Rutina Nueva';
    const groupId = 1;
    const exercises: ExerciseResume[] = [
      {
        id: 1,
        name: 'Ejercicio 1',
        notes: 'Nota 1',
        restTime: '0',
        sets: [{ reps: 0, weight: 0 }],
        thumbnailUrl: '',
        primaryMuscleGroup: '',
      },
      {
        id: 2,
        name: 'Ejercicio 2',
        notes: 'Nota 2',
        restTime: '60',
        sets: [],
        thumbnailUrl: '',
        primaryMuscleGroup: '',
      },
    ];

    // Mock de supabaseClient.post para insertar el workout_template
    const postWorkoutTemplateMock = jest.fn().mockResolvedValue({
      data: [{ id: 100 }],
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    });

    // Mock de supabaseClient.post para insertar el workout
    const postWorkoutMock = jest.fn().mockResolvedValue({
      data: [{ id: 200 }],
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    });

    // Mock de supabaseClient.post para insertar los workout_exercises
    const postWorkoutExerciseMock = jest.fn().mockResolvedValue({
      data: [{ id: 300 }],
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    });

    // Asignamos los mocks a supabaseClient.post
    (supabaseClient.post as jest.Mock).mockImplementation((url: string) => {
      if (url === '/workout_templates') {
        return postWorkoutTemplateMock();
      } else if (url === '/workouts') {
        return postWorkoutMock();
      } else if (url === '/workout_exercises') {
        return postWorkoutExerciseMock();
      }
    });

    // Ejecución
    const result = await useCreateRoutine(name, exercises, groupId);

    // Verificación
    expect(supabaseClient.post).toHaveBeenCalledWith('/workout_templates', {
      name,
      user_id: 1,
      group_id: groupId,
      deleted: false,
    });

    expect(supabaseClient.post).toHaveBeenCalledWith('/workouts', {
      template_id: 100,
      template: true,
    });

    // Verificamos la inserción de los ejercicios
    // Primer ejercicio con sets
    expect(supabaseClient.post).toHaveBeenCalledWith('/workout_exercises', {
      workout_id: 200,
      exercise_id: 1,
      sets: 1,
      reps: null, // reps es 0, debe ser null
      weight: null, // weight es 0, debe ser null
      notes: 'Nota 1',
      rest_time: null, // restTime es '0', debe ser null
    });

    // Segundo ejercicio sin sets
    expect(supabaseClient.post).toHaveBeenCalledWith('/workout_exercises', {
      workout_id: 200,
      exercise_id: 2,
      notes: 'Nota 2',
      rest_time: '60',
    });

    expect(result.error).toBeNull();
  });

  it('debe manejar errores al insertar el workout_template', async () => {
    // Preparación
    const name = 'Rutina Nueva';
    const groupId = 1;
    const exercises: ExerciseResume[] = [];
    const mockError = 'Error al insertar workout_template';

    (supabaseClient.post as jest.Mock).mockImplementation((url: string) => {
      if (url === '/workout_templates') {
        return Promise.reject(new Error(mockError));
      }
    });

    // Ejecución
    const result = await useCreateRoutine(name, exercises, groupId);

    // Verificación
    expect(result.error).toBe(mockError);
  });

  it('debe manejar errores al insertar el workout', async () => {
    // Preparación
    const name = 'Rutina Nueva';
    const groupId = 1;
    const exercises: ExerciseResume[] = [];
    const mockError = 'Error al insertar workout';

    (supabaseClient.post as jest.Mock).mockImplementation((url: string) => {
      if (url === '/workout_templates') {
        return Promise.resolve({
          data: [{ id: 100 }],
          status: 201,
          statusText: 'Created',
          headers: {},
          config: {},
        });
      } else if (url === '/workouts') {
        return Promise.reject(new Error(mockError));
      }
    });

    // Ejecución
    const result = await useCreateRoutine(name, exercises, groupId);

    // Verificación
    expect(result.error).toBe(mockError);
  });

  it('debe manejar errores al insertar un workout_exercise', async () => {
    // Preparación
    const name = 'Rutina Nueva';
    const groupId = 1;
    const exercises: ExerciseResume[] = [
      {
        id: 1,
        name: 'Ejercicio 1',
        notes: 'Nota 1',
        restTime: '60',
        sets: [{ reps: 10, weight: 50 }],
        thumbnailUrl: '',
        primaryMuscleGroup: '',
      },
    ];
    const mockError = 'Error al insertar workout_exercise';

    (supabaseClient.post as jest.Mock).mockImplementation((url: string) => {
      if (url === '/workout_templates') {
        return Promise.resolve({
          data: [{ id: 100 }],
          status: 201,
          statusText: 'Created',
          headers: {},
          config: {},
        });
      } else if (url === '/workouts') {
        return Promise.resolve({
          data: [{ id: 200 }],
          status: 201,
          statusText: 'Created',
          headers: {},
          config: {},
        });
      } else if (url === '/workout_exercises') {
        return Promise.reject(new Error(mockError));
      }
    });

    // Ejecución
    const result = await useCreateRoutine(name, exercises, groupId);

    // Verificación
    expect(result.error).toBe(mockError);
  });
});

describe('useUpdateRoutine', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe actualizar una rutina y sus ejercicios asociados exitosamente', async () => {
    // Preparación
    const templateId = 1;
    const name = 'Rutina Actualizada';
    const exercises: ExerciseResume[] = [
      {
        id: 1,
        name: 'Ejercicio 1',
        notes: 'Nota Actualizada',
        restTime: '0',
        sets: [{ reps: 0, weight: 0 }],
        thumbnailUrl: '',
        primaryMuscleGroup: '',
      },
    ];

    const patchWorkoutTemplateMock = jest.fn().mockResolvedValue({
      data: [{ id: templateId, name }],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    const postWorkoutMock = jest.fn().mockResolvedValue({
      data: [{ id: 200 }],
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    });

    const postWorkoutExerciseMock = jest.fn().mockResolvedValue({
      data: [{ id: 300 }],
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    });

    (supabaseClient.patch as jest.Mock).mockImplementation(() =>
      patchWorkoutTemplateMock()
    );
    (supabaseClient.post as jest.Mock).mockImplementation((url: string) => {
      if (url === '/workouts') {
        return postWorkoutMock();
      } else if (url === '/workout_exercises') {
        return postWorkoutExerciseMock();
      }
    });

    // Ejecución
    const result = await useUpdateRoutine(templateId, name, exercises);

    // Verificación
    expect(supabaseClient.patch).toHaveBeenCalledWith(
      '/workout_templates',
      { name },
      { params: { id: `eq.${templateId}` } }
    );

    expect(supabaseClient.post).toHaveBeenCalledWith('/workouts', {
      template_id: templateId,
      template: true,
    });

    expect(supabaseClient.post).toHaveBeenCalledWith('/workout_exercises', {
      workout_id: 200,
      exercise_id: 1,
      sets: 1,
      reps: null,
      weight: null,
      notes: 'Nota Actualizada',
      rest_time: null,
    });

    expect(result.error).toBeNull();
  });

  it('debe manejar errores al actualizar el workout_template', async () => {
    // Preparación
    const templateId = 1;
    const name = 'Rutina Actualizada';
    const exercises: ExerciseResume[] = [];
    const mockError = 'Error al actualizar workout_template';

    (supabaseClient.patch as jest.Mock).mockRejectedValue(new Error(mockError));

    // Ejecución
    const result = await useUpdateRoutine(templateId, name, exercises);

    // Verificación
    expect(result.error).toBe(mockError);
  });

  it('debe manejar errores al insertar el workout', async () => {
    // Preparación
    const templateId = 1;
    const name = 'Rutina Actualizada';
    const exercises: ExerciseResume[] = [];
    const mockError = 'Error al insertar workout';

    (supabaseClient.patch as jest.Mock).mockResolvedValue({
      data: [{ id: templateId, name }],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    (supabaseClient.post as jest.Mock).mockImplementation((url: string) => {
      if (url === '/workouts') {
        return Promise.reject(new Error(mockError));
      }
    });

    // Ejecución
    const result = await useUpdateRoutine(templateId, name, exercises);

    // Verificación
    expect(result.error).toBe(mockError);
  });

  it('debe manejar errores al insertar un workout_exercise', async () => {
    // Preparación
    const templateId = 1;
    const name = 'Rutina Actualizada';
    const exercises: ExerciseResume[] = [
      {
        id: 1,
        name: 'Ejercicio 1',
        notes: 'Nota Actualizada',
        restTime: '60',
        sets: [{ reps: 10, weight: 50 }],
        thumbnailUrl: '',
        primaryMuscleGroup: '',
      },
    ];
    const mockError = 'Error al insertar workout_exercise';

    (supabaseClient.patch as jest.Mock).mockResolvedValue({
      data: [{ id: templateId, name }],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    (supabaseClient.post as jest.Mock).mockImplementation((url: string) => {
      if (url === '/workouts') {
        return Promise.resolve({
          data: [{ id: 200 }],
          status: 201,
          statusText: 'Created',
          headers: {},
          config: {},
        });
      } else if (url === '/workout_exercises') {
        return Promise.reject(new Error(mockError));
      }
    });

    // Ejecución
    const result = await useUpdateRoutine(templateId, name, exercises);

    // Verificación
    expect(result.error).toBe(mockError);
  });
});
