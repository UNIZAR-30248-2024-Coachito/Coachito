import { useFetchDashboardWorkouts } from '@/hooks/dashboardHook';
import { supabase } from '@/api/supabaseClient';

jest.mock('@/api/supabaseClient');

describe('useFetchDashboardWorkouts', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe llamar a supabase.rpc con el nombre del procedimiento correcto y retornar datos exitosamente', async () => {
    const mockData = [{ id: 1, name: 'Workout 1' }];
    const rpcMock = jest.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchDashboardWorkouts();

    expect(supabase.rpc).toHaveBeenCalledWith('get_dashboard_details');
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando supabase.rpc retorna un error', async () => {
    const mockError = { message: 'Error al obtener los datos' };
    const rpcMock = jest.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchDashboardWorkouts();

    expect(supabase.rpc).toHaveBeenCalledWith('get_dashboard_details');
    expect(result.data).toBeNull();
    expect(result.error).toEqual(mockError);
  });

  it('debe manejar errores inesperados lanzados durante la ejecución', async () => {
    const unexpectedError = new Error('Error inesperado');
    const rpcMock = jest.fn().mockRejectedValue(unexpectedError);
    (supabase.rpc as jest.Mock) = rpcMock;

    const result = await useFetchDashboardWorkouts();

    expect(supabase.rpc).toHaveBeenCalledWith('get_dashboard_details');
    expect(result.data).toBeNull();
    expect(result.error).toEqual(unexpectedError);
  });
});
