import {
  useFetchExercisesList,
  useFetchExerciseDetails,
} from '@/hooks/exerciseHook';
import { supabase } from '@/api/supabaseClient';

jest.mock('@/api/supabaseClient');

describe('useFetchExercisesList', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe llamar a supabase.rpc con el nombre correcto de la función y retornar datos exitosamente', async () => {
    const mockData = [{ id: 1, name: 'Ejercicio 1' }];
    const rpcMock = jest.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchExercisesList();

    expect(supabase.rpc).toHaveBeenCalledWith('get_exercises_list');
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabase.rpc rechaza', async () => {
    const mockError = new Error('Error de red');
    const rpcMock = jest.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchExercisesList();

    expect(supabase.rpc).toHaveBeenCalledWith('get_exercises_list');
    expect(result.data).toBeNull();
    expect(result.error).toBe(mockError);
  });

  it('debe manejar errores inesperados correctamente', async () => {
    const mockError = new Error('Error inesperado');
    const rpcMock = jest.fn().mockRejectedValue(mockError);
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchExercisesList();

    expect(supabase.rpc).toHaveBeenCalledWith('get_exercises_list');
    expect(result.data).toBeNull();
    expect(result.error).toBe(mockError);
  });
});

describe('useFetchExerciseDetails', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe llamar a supabase.rpc con la ruta y parámetros correctos y retornar datos exitosamente', async () => {
    const exerciseId = 1;
    const mockData = {
      id: exerciseId,
      name: 'Ejercicio 1',
      details: 'Detalles del ejercicio',
    };
    const rpcMock = jest.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchExerciseDetails(exerciseId);

    expect(supabase.rpc).toHaveBeenCalledWith('get_exercise_details', {
      ex_id: exerciseId,
    });
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabase.rpc rechaza', async () => {
    const exerciseId = 1;
    const mockError = new Error('Error de red');
    const rpcMock = jest.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchExerciseDetails(exerciseId);

    expect(supabase.rpc).toHaveBeenCalledWith('get_exercise_details', {
      ex_id: exerciseId,
    });
    expect(result.data).toBeNull();
    expect(result.error).toBe(mockError);
  });
});
