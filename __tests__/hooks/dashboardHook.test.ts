import { useFetchDashboardWorkouts } from '@/hooks/dashboardHook';
import supabaseClient from '@/api/supabaseClient';

jest.mock('@/api/supabaseClient');

describe('useFetchDashboardWorkouts', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe llamar a supabaseClient.get con la ruta correcta y retornar datos exitosamente', async () => {
    // Preparación
    const mockData = [{ id: 1, name: 'Workout 1' }];
    const getMock = jest.fn().mockResolvedValue({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchDashboardWorkouts();

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_dashboard_details'
    );
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabaseClient.get rechaza', async () => {
    // Preparación
    const mockError = new Error('Error de red');
    const getMock = jest.fn().mockRejectedValue(mockError);
    (supabaseClient.get as jest.Mock) = getMock;

    // Ejecución
    const result = await useFetchDashboardWorkouts();

    // Verificación
    expect(supabaseClient.get).toHaveBeenCalledWith(
      '/rpc/get_dashboard_details'
    );
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});
