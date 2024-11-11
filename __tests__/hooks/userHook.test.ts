import { useFetchUserWorkouts } from '@/hooks/userHook';
import supabaseClient from '@/api/supabaseClient';

jest.mock('@/api/supabaseClient');

describe('useFetchUserWorkouts', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe llamar a supabaseClient.get con la ruta y parámetros correctos y retornar datos exitosamente', async () => {
    // Preparación
    const userId = 1;
    const mockData = {
      id: userId,
      name: 'Test',
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
    const result = await useFetchUserWorkouts(userId);

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith('/rpc/get_user_workouts', {
      params: { user_id: userId },
    });
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabaseClient.get rechaza', async () => {
    // Preparación
    const userId = 1;
    const mockError = new Error('Error de red');
    const getMock = jest.fn().mockRejectedValue(mockError);
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchUserWorkouts(userId);

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith('/rpc/get_user_workouts', {
      params: { user_id: userId },
    });
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});
