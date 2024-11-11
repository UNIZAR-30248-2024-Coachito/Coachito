// functions.test.ts
import {
  useFetchDetailsLastWorkout,
  useFetchDetailsWorkout,
  useCreateWorkout,
  useFetchRoutineWorkouts,
} from '@/hooks/workoutHook';
import supabaseClient from '@/api/supabaseClient';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';

jest.mock('@/api/supabaseClient');

describe('useFetchDetailsLastWorkout', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe llamar a supabaseClient.get con los parámetros correctos y retornar datos exitosamente', async () => {
    // Preparación
    const templateId = 1;
    const mockData = {
      id: templateId,
      details: 'Detalles del último entrenamiento',
    };
    const getMock = jest.fn().mockResolvedValue({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchDetailsLastWorkout(templateId);

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_last_workout_details',
      {
        params: { templ_id: templateId },
      }
    );
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabaseClient.get rechaza', async () => {
    // Preparación
    const templateId = 1;
    const mockError = new Error('Error de red');
    const getMock = jest.fn().mockRejectedValue(mockError);
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchDetailsLastWorkout(templateId);

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_last_workout_details',
      {
        params: { templ_id: templateId },
      }
    );
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});

describe('useFetchDetailsWorkout', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe llamar a supabaseClient.get con los parámetros correctos y retornar datos exitosamente', async () => {
    // Preparación
    const workoutId = 1;
    const mockData = { id: workoutId, details: 'Detalles del entrenamiento' };
    const getMock = jest.fn().mockResolvedValue({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchDetailsWorkout(workoutId);

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_workout_details',
      {
        params: { w_id: workoutId },
      }
    );
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabaseClient.get rechaza', async () => {
    // Preparación
    const workoutId = 1;
    const mockError = new Error('Error de red');
    const getMock = jest.fn().mockRejectedValue(mockError);
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchDetailsWorkout(workoutId);

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_workout_details',
      {
        params: { w_id: workoutId },
      }
    );
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});

describe('useFetchRoutineWorkouts', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe llamar a supabaseClient.get con los parámetros correctos y retornar datos exitosamente', async () => {
    // Preparación
    const templateId = 1;
    const mockData = [{ date: '2023-01-01', volume: 100 }];
    const getMock = jest.fn().mockResolvedValue({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchRoutineWorkouts(templateId);

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_routine_chart_data',
      {
        params: { templ_id: templateId },
      }
    );
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabaseClient.get rechaza', async () => {
    // Preparación
    const templateId = 1;
    const mockError = new Error('Error de red');
    const getMock = jest.fn().mockRejectedValue(mockError);
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchRoutineWorkouts(templateId);

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_routine_chart_data',
      {
        params: { templ_id: templateId },
      }
    );
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});

describe('useCreateWorkout', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe crear un entrenamiento y ejercicios asociados exitosamente', async () => {
    // Preparación
    const templateId = 1;
    const duration = 60;
    const exercises: ExerciseResume[] = [
      {
        id: 1,
        name: 'Ejercicio 1',
        notes: 'Nota 1',
        restTime: '60',
        sets: [
          { reps: 10, weight: 50 },
          { reps: 8, weight: 55 },
        ],
        thumbnailUrl: '',
        primaryMuscleGroup: '',
      },
      {
        id: 2,
        name: 'Ejercicio 2',
        notes: 'Nota 2',
        restTime: '90',
        sets: [],
        thumbnailUrl: '',
        primaryMuscleGroup: '',
      },
    ];

    // Calculamos el volumen total para verificar más adelante
    const totalVolume = exercises.reduce((acc, exercise) => {
      const exerciseVolume = exercise.sets!.reduce((setAcc, set) => {
        return setAcc + set.reps * set.weight;
      }, 0);
      return acc + exerciseVolume;
    }, 0);

    // Mock de supabaseClient.post para insertar el entrenamiento
    const postWorkoutMock = jest.fn().mockResolvedValue({
      data: [{ id: 100 }],
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    });

    // Mock de supabaseClient.post para insertar los ejercicios del entrenamiento
    const postWorkoutExerciseMock = jest.fn().mockResolvedValue({
      data: [{ id: 200 }],
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    });

    // Asignamos los mocks a supabaseClient.post
    (supabaseClient.post as jest.Mock).mockImplementation((url: string) => {
      if (url === '/workouts') {
        return postWorkoutMock();
      } else if (url === '/workout_exercises') {
        return postWorkoutExerciseMock();
      }
    });

    // Ejecución
    const result = await useCreateWorkout(templateId, duration, exercises);

    // Verificación
    expect(supabaseClient.post).toHaveBeenCalledWith('/workouts', {
      template_id: templateId,
      volume: totalVolume,
      duration: duration,
      template: false,
    });

    // Verificamos que se hayan insertado los ejercicios correctamente
    expect(supabaseClient.post).toHaveBeenCalledWith('/workout_exercises', {
      workout_id: 100, // ID del workout insertado
      exercise_id: 1,
      sets: 1,
      reps: 10,
      weight: 50,
      notes: 'Nota 1',
      rest_time: '60',
    });
    expect(supabaseClient.post).toHaveBeenCalledWith('/workout_exercises', {
      workout_id: 100,
      exercise_id: 1,
      sets: 1,
      reps: 8,
      weight: 55,
      notes: 'Nota 1',
      rest_time: '60',
    });
    expect(supabaseClient.post).toHaveBeenCalledWith('/workout_exercises', {
      workout_id: 100,
      exercise_id: 2,
      notes: 'Nota 2',
      rest_time: '90',
    });

    expect(result.error).toBeNull();
  });

  it('debe manejar errores al insertar el entrenamiento', async () => {
    // Preparación
    const templateId = 1;
    const duration = 60;
    const exercises: ExerciseResume[] = [];
    const mockError = new Error('Error al insertar entrenamiento');

    const postWorkoutMock = jest.fn().mockRejectedValue(mockError);
    (supabaseClient.post as jest.Mock).mockImplementation((url: string) => {
      if (url === '/workouts') {
        return postWorkoutMock();
      }
    });

    // Ejecución
    const result = await useCreateWorkout(templateId, duration, exercises);

    // Verificación
    expect(supabaseClient.post).toHaveBeenCalledWith('/workouts', {
      template_id: templateId,
      volume: 0,
      duration: duration,
      template: false,
    });
    expect(result.error).toBe('Error al insertar entrenamiento');
  });

  it('debe manejar errores al insertar un ejercicio del entrenamiento', async () => {
    // Preparación
    const templateId = 1;
    const duration = 60;
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

    const postWorkoutMock = jest.fn().mockResolvedValue({
      data: [{ id: 100 }],
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    });

    const mockError = new Error('Error al insertar ejercicio');
    const postWorkoutExerciseMock = jest.fn().mockRejectedValue(mockError);

    (supabaseClient.post as jest.Mock).mockImplementation((url: string) => {
      if (url === '/workouts') {
        return postWorkoutMock();
      } else if (url === '/workout_exercises') {
        return postWorkoutExerciseMock();
      }
    });

    // Ejecución
    const result = await useCreateWorkout(templateId, duration, exercises);

    // Verificación
    expect(supabaseClient.post).toHaveBeenCalledWith('/workouts', {
      template_id: templateId,
      volume: 500, // 10 reps * 50 weight
      duration: duration,
      template: false,
    });

    expect(supabaseClient.post).toHaveBeenCalledWith('/workout_exercises', {
      workout_id: 100,
      exercise_id: 1,
      sets: 1,
      reps: 10,
      weight: 50,
      notes: 'Nota 1',
      rest_time: '60',
    });

    expect(result.error).toBe('Error al insertar ejercicio');
  });
});
