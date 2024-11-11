import {
  useFetchExercisesList,
  useFetchExerciseDetails,
} from '@/hooks/exerciseHook';
import supabaseClient from '@/api/supabaseClient';

jest.mock('@/api/supabaseClient');

describe('useFetchExercisesList', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe llamar a supabaseClient.get con la ruta correcta y retornar datos exitosamente', async () => {
    // Preparación
    const mockData = [{ id: 1, name: 'Ejercicio 1' }];
    const getMock = jest.fn().mockResolvedValue({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchExercisesList();

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith('/rpc/get_exercises_list');
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabaseClient.get rechaza', async () => {
    // Preparación
    const mockError = new Error('Error de red');
    const getMock = jest.fn().mockRejectedValue(mockError);
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchExercisesList();

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith('/rpc/get_exercises_list');
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});

describe('useFetchExerciseDetails', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe llamar a supabaseClient.get con la ruta y parámetros correctos y retornar datos exitosamente', async () => {
    // Preparación
    const exerciseId = 1;
    const mockData = {
      id: exerciseId,
      name: 'Ejercicio 1',
      details: 'Detalles del ejercicio',
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
    const result = await useFetchExerciseDetails(exerciseId);

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_exercise_details',
      {
        params: { ex_id: exerciseId },
      }
    );
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabaseClient.get rechaza', async () => {
    // Preparación
    const exerciseId = 1;
    const mockError = new Error('Error de red');
    const getMock = jest.fn().mockRejectedValue(mockError);
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchExerciseDetails(exerciseId);

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_exercise_details',
      {
        params: { ex_id: exerciseId },
      }
    );
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});
