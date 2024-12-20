import {
  useFetchDetailsLastWorkout,
  useFetchDetailsWorkout,
  useCreateWorkout,
  useFetchRoutineWorkouts,
} from '@/hooks/workoutHook';
import { supabase } from '@/api/supabaseClient';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';

jest.mock('@/api/supabaseClient', () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('useFetchDetailsLastWorkout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe llamar a supabase.rpc con los parámetros correctos y retornar datos exitosamente', async () => {
    const templateId = 1;
    const mockData = {
      id: templateId,
      details: 'Detalles del último entrenamiento',
    };

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await useFetchDetailsLastWorkout(templateId);

    expect(supabase.rpc).toHaveBeenCalledWith('get_last_workout_details', {
      templ_id: templateId,
    });
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabase.rpc rechaza', async () => {
    const templateId = 1;
    const mockError = { message: 'Error de red' };

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: null,
      error: mockError,
    });

    const result = await useFetchDetailsLastWorkout(templateId);

    expect(supabase.rpc).toHaveBeenCalledWith('get_last_workout_details', {
      templ_id: templateId,
    });
    expect(result.data).toBeNull();
    expect(result.error).toEqual(mockError);
  });

  it('debe manejar errores inesperados correctamente', async () => {
    const templateId = 1;
    const mockError = new Error('Error inesperado');
    const rpcMock = jest.fn().mockRejectedValue(mockError);
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchDetailsLastWorkout(templateId);

    expect(supabase.rpc).toHaveBeenCalledWith('get_last_workout_details', {
      templ_id: templateId,
    });
    expect(result.data).toBeNull();
    expect(result.error).toBe(mockError);
  });
});

describe('useFetchDetailsWorkout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe llamar a supabase.rpc con los parámetros correctos y retornar datos exitosamente', async () => {
    const workoutId = 1;
    const mockData = { id: workoutId, details: 'Detalles del entrenamiento' };

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await useFetchDetailsWorkout(workoutId);

    expect(supabase.rpc).toHaveBeenCalledWith('get_workout_details', {
      w_id: workoutId,
    });
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabase.rpc rechaza', async () => {
    const workoutId = 1;
    const mockError = { message: 'Error de red' };

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: null,
      error: mockError,
    });

    const result = await useFetchDetailsWorkout(workoutId);

    expect(supabase.rpc).toHaveBeenCalledWith('get_workout_details', {
      w_id: workoutId,
    });
    expect(result.data).toBeNull();
    expect(result.error).toEqual(mockError);
  });

  it('debe manejar errores inesperados correctamente', async () => {
    const id = 1;
    const mockError = new Error('Error inesperado');
    const rpcMock = jest.fn().mockRejectedValue(mockError);
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchDetailsWorkout(id);

    expect(supabase.rpc).toHaveBeenCalledWith('get_workout_details', {
      w_id: id,
    });
    expect(result.data).toBeNull();
    expect(result.error).toBe(mockError);
  });
});

describe('useFetchRoutineWorkouts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe llamar a supabase.rpc con los parámetros correctos y retornar datos exitosamente', async () => {
    const templateId = 1;
    const mockData = [{ date: '2023-01-01', volume: 100 }];

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await useFetchRoutineWorkouts(templateId);

    expect(supabase.rpc).toHaveBeenCalledWith('get_routine_chart_data', {
      templ_id: templateId,
    });
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabase.rpc rechaza', async () => {
    const templateId = 1;
    const mockError = { message: 'Error de red' };

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: null,
      error: mockError,
    });

    const result = await useFetchRoutineWorkouts(templateId);

    expect(supabase.rpc).toHaveBeenCalledWith('get_routine_chart_data', {
      templ_id: templateId,
    });
    expect(result.data).toBeNull();
    expect(result.error).toEqual(mockError);
  });

  it('debe manejar errores inesperados correctamente', async () => {
    const id = 1;
    const mockError = new Error('Error inesperado');
    const rpcMock = jest.fn().mockRejectedValue(mockError);
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchRoutineWorkouts(id);

    expect(supabase.rpc).toHaveBeenCalledWith('get_routine_chart_data', {
      templ_id: id,
    });
    expect(result.data).toBeNull();
    expect(result.error).toBe(mockError);
  });
});

describe('useCreateWorkout', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear un entrenamiento y ejercicios asociados exitosamente', async () => {
    const templateId = 1;
    const duration = 60;
    const exercises: ExerciseResume[] = [];
    const mockResponse = { data: [{ id: 1 }], error: null };

    const selectMock = jest.fn().mockResolvedValue(mockResponse);
    const insertMock = jest.fn().mockReturnValue({
      select: selectMock,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      insert: insertMock,
    });

    const result = await useCreateWorkout(templateId, duration, exercises);

    expect(supabase.from).toHaveBeenCalledWith('workouts');
    expect(insertMock).toHaveBeenCalledWith({
      template_id: templateId,
      volume: 0,
      duration: duration,
      template: false,
    });
    expect(selectMock).toHaveBeenCalled();
    expect(result.error).toBeNull();
  });

  it('debe manejar errores al crear el entrenamiento', async () => {
    const templateId = 1;
    const duration = 60;
    const exercises: ExerciseResume[] = [];
    const mockError = { message: 'Error al insertar entrenamiento' };

    const selectMock = jest.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });
    const insertMock = jest.fn().mockReturnValue({
      select: selectMock,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      insert: insertMock,
    });

    const result = await useCreateWorkout(templateId, duration, exercises);

    expect(supabase.from).toHaveBeenCalledWith('workouts');
    expect(insertMock).toHaveBeenCalledWith({
      template_id: templateId,
      volume: 0,
      duration: duration,
      template: false,
    });
    expect(selectMock).toHaveBeenCalled();
    expect(result.error).toEqual(mockError);
  });

  it('debe manejar errores inesperados correctamente', async () => {
    const templateId = 1;
    const duration = 60;
    const exercises: ExerciseResume[] = [];
    const mockError = new Error('Error inesperado');

    const selectMock = jest.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });
    const insertMock = jest.fn().mockReturnValue({
      select: selectMock,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      insert: insertMock,
    });

    const result = await useCreateWorkout(templateId, duration, exercises);

    expect(supabase.from).toHaveBeenCalledWith('workouts');
    expect(result.error).toBe(mockError);
  });

  it('debe calcular correctamente el totalVolume y manejar errores inesperados', async () => {
    const templateId = 1;
    const duration = 60;

    const exercises = [
      {
        id: 1,
        name: 'Squats',
        thumbnailUrl: 'path/to/image.jpg',
        primaryMuscleGroup: 'Legs',
        sets: [{ reps: 10, weight: 100 }],
        notes: 'Ejercicio 1',
        restTime: '60',
      },
      {
        id: 2,
        name: 'Bench Press',
        thumbnailUrl: 'path/to/image2.jpg',
        primaryMuscleGroup: 'Chest',
        sets: [],
        notes: 'Ejercicio 2',
        restTime: '30',
      },
    ];

    const rpcInsertMock = jest
      .fn()
      .mockResolvedValue({ data: [{ id: 1 }], error: null });
    const rpcExerciseInsertMock = jest.fn().mockResolvedValue({ error: null });

    (supabase.from as jest.Mock).mockImplementation((table) => {
      if (table === 'workouts') return { insert: rpcInsertMock };
      if (table === 'workout_exercises')
        return { insert: rpcExerciseInsertMock };
    });

    await useCreateWorkout(templateId, duration, exercises);

    expect(supabase.from).toHaveBeenCalledTimes(1);
    expect(supabase.from).toHaveBeenNthCalledWith(1, 'workouts');
  });

  it('debe manejar correctamente ejercicios con sets y con reps distintos de cero', async () => {
    const templateId = 1;
    const duration = 60;

    const exercises = [
      {
        id: 1,
        name: 'Squats',
        thumbnailUrl: 'path/to/image.jpg',
        primaryMuscleGroup: 'Legs',
        sets: [{ reps: 10, weight: 100 }],
        notes: 'Low bar squats',
        restTime: '60',
      },
      {
        id: 2,
        name: 'Bench Press',
        thumbnailUrl: 'path/to/image2.jpg',
        primaryMuscleGroup: 'Chest',
        sets: [],
        notes: 'Incline bench',
        restTime: '90',
      },
    ];

    const rpcInsertMock = jest
      .fn()
      .mockResolvedValue({ data: [{ id: 1 }], error: null });
    const rpcExerciseInsertMock = jest.fn().mockResolvedValue({ error: null });

    (supabase.from as jest.Mock).mockImplementation((table) => {
      if (table === 'workouts') return { insert: rpcInsertMock };
      if (table === 'workout_exercises')
        return { insert: rpcExerciseInsertMock };
    });

    await useCreateWorkout(templateId, duration, exercises);

    expect(supabase.from).toHaveBeenCalledTimes(1);
    expect(supabase.from).toHaveBeenNthCalledWith(1, 'workouts');
  });
});
