// functions.test.ts
import {
  useCreateTemplateWorkoutGroup,
  useEditTemplateWorkoutGroup,
  useDeleteTemplateWorkoutGroupById,
} from '@/hooks/workoutTemplateGroupHook';
import supabaseClient from '@/api/supabaseClient';

jest.mock('@/api/supabaseClient');

describe('useCreateTemplateWorkoutGroup', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe crear un grupo de entrenamiento exitosamente', async () => {
    // Preparación
    const name = 'Nuevo Grupo de Entrenamiento';
    const mockData = { id: 1, name };
    (supabaseClient.post as jest.Mock).mockResolvedValue({
      data: mockData,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    });

    // Ejecución
    const result = await useCreateTemplateWorkoutGroup(name);

    // Verificación
    expect(supabaseClient.post).toHaveBeenCalledWith(
      '/workout_templates_group',
      { name }
    );
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando la creación del grupo falla', async () => {
    // Preparación
    const name = 'Nuevo Grupo de Entrenamiento';
    const mockError = new Error('Error de red');
    (supabaseClient.post as jest.Mock).mockRejectedValue(mockError);

    // Ejecución
    const result = await useCreateTemplateWorkoutGroup(name);

    // Verificación
    expect(supabaseClient.post).toHaveBeenCalledWith(
      '/workout_templates_group',
      { name }
    );
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});

describe('useEditTemplateWorkoutGroup', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe editar un grupo de entrenamiento exitosamente', async () => {
    // Preparación
    const id = 1;
    const name = 'Grupo de Entrenamiento Actualizado';
    const mockData = { id, name };
    (supabaseClient.patch as jest.Mock).mockResolvedValue({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    // Ejecución
    const result = await useEditTemplateWorkoutGroup(id, name);

    // Verificación
    expect(supabaseClient.patch).toHaveBeenCalledWith(
      '/workout_templates_group',
      { name },
      { params: { id: `eq.${id}` } }
    );
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando la edición del grupo falla', async () => {
    // Preparación
    const id = 1;
    const name = 'Grupo de Entrenamiento Actualizado';
    const mockError = new Error('Error de red');
    (supabaseClient.patch as jest.Mock).mockRejectedValue(mockError);

    // Ejecución
    const result = await useEditTemplateWorkoutGroup(id, name);

    // Verificación
    expect(supabaseClient.patch).toHaveBeenCalledWith(
      '/workout_templates_group',
      { name },
      { params: { id: `eq.${id}` } }
    );
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});

describe('useDeleteTemplateWorkoutGroupById', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe eliminar un grupo de entrenamiento exitosamente', async () => {
    // Preparación
    const id = 1;
    const mockData = { message: 'Eliminado exitosamente' };
    (supabaseClient.delete as jest.Mock).mockResolvedValue({
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    // Ejecución
    const result = await useDeleteTemplateWorkoutGroupById(id);

    // Verificación
    expect(supabaseClient.delete).toHaveBeenCalledWith(
      '/workout_templates_group',
      {
        params: { id: `eq.${id}` },
      }
    );
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando la eliminación del grupo falla', async () => {
    // Preparación
    const id = 1;
    const mockError = new Error('Error de red');
    (supabaseClient.delete as jest.Mock).mockRejectedValue(mockError);

    // Ejecución
    const result = await useDeleteTemplateWorkoutGroupById(id);

    // Verificación
    expect(supabaseClient.delete).toHaveBeenCalledWith(
      '/workout_templates_group',
      {
        params: { id: `eq.${id}` },
      }
    );
    expect(result.data).toBeNull();
    expect(result.error).toBe('Error de red');
  });
});
