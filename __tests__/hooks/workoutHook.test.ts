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
});
