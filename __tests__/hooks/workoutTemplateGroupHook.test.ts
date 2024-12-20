import {
  useCreateTemplateWorkoutGroup,
  useEditTemplateWorkoutGroup,
  useDeleteTemplateWorkoutGroupById,
} from '@/hooks/workoutTemplateGroupHook';
import { supabase } from '@/api/supabaseClient';

jest.mock('@/api/supabaseClient');

describe('useCreateTemplateWorkoutGroup', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe crear un grupo de entrenamiento exitosamente', async () => {
    const name = 'Nuevo Grupo de Entrenamiento';
    const user_id = 'user123';
    const mockData = { id: 1, name };
    const insertMock = jest.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });
    (supabase.from as jest.Mock).mockReturnValue({ insert: insertMock });

    const result = await useCreateTemplateWorkoutGroup(name, user_id);

    expect(supabase.from).toHaveBeenCalledWith('workout_templates_group');
    expect(insertMock).toHaveBeenCalledWith([{ name, user_id }]);
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando la creación del grupo falla', async () => {
    const name = 'Nuevo Grupo de Entrenamiento';
    const user_id = 'user123';
    const mockError = { message: 'Error de red' };
    const insertMock = jest.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });
    (supabase.from as jest.Mock).mockReturnValue({ insert: insertMock });

    const result = await useCreateTemplateWorkoutGroup(name, user_id);

    expect(supabase.from).toHaveBeenCalledWith('workout_templates_group');
    expect(insertMock).toHaveBeenCalledWith([{ name, user_id }]);
    expect(result.data).toBeNull();
    expect(result.error).toEqual(mockError);
  });
});

describe('useEditTemplateWorkoutGroup', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe editar un grupo de entrenamiento exitosamente', async () => {
    const id = 1;
    const name = 'Grupo de Entrenamiento Actualizado';
    const mockData = { id, name };
    const eqMock = jest.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });
    const updateMock = jest.fn().mockReturnValue({ eq: eqMock });
    (supabase.from as jest.Mock).mockReturnValue({ update: updateMock });

    const result = await useEditTemplateWorkoutGroup(id, name);

    expect(supabase.from).toHaveBeenCalledWith('workout_templates_group');
    expect(updateMock).toHaveBeenCalledWith({ name });
    expect(updateMock().eq).toHaveBeenCalledWith('id', id);
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando la edición del grupo falla', async () => {
    const id = 1;
    const name = 'Grupo de Entrenamiento Actualizado';
    const mockError = { message: 'Error de red' };
    const eqMock = jest.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });
    const updateMock = jest.fn().mockReturnValue({ eq: eqMock });
    (supabase.from as jest.Mock).mockReturnValue({ update: updateMock });

    const result = await useEditTemplateWorkoutGroup(id, name);

    expect(supabase.from).toHaveBeenCalledWith('workout_templates_group');
    expect(updateMock).toHaveBeenCalledWith({ name });
    expect(updateMock().eq).toHaveBeenCalledWith('id', id);
    expect(result.data).toBeNull();
    expect(result.error).toEqual(mockError);
  });
});

describe('useDeleteTemplateWorkoutGroupById', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('debe eliminar un grupo de entrenamiento exitosamente', async () => {
    const id = 1;
    const mockData = { message: 'Eliminado exitosamente' };
    const eqMock = jest.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });
    const deleteMock = jest.fn().mockReturnValue({ eq: eqMock });
    (supabase.from as jest.Mock).mockReturnValue({ delete: deleteMock });

    const result = await useDeleteTemplateWorkoutGroupById(id);

    expect(supabase.from).toHaveBeenCalledWith('workout_templates_group');
    expect(deleteMock).toHaveBeenCalledWith();
    expect(deleteMock().eq).toHaveBeenCalledWith('id', id);
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('debe manejar errores cuando la eliminación del grupo falla', async () => {
    const id = 1;
    const mockError = { message: 'Error de red' };
    const eqMock = jest.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });
    const deleteMock = jest.fn().mockReturnValue({ eq: eqMock });
    (supabase.from as jest.Mock).mockReturnValue({ delete: deleteMock });

    const result = await useDeleteTemplateWorkoutGroupById(id);

    expect(supabase.from).toHaveBeenCalledWith('workout_templates_group');
    expect(deleteMock).toHaveBeenCalledWith();
    expect(deleteMock().eq).toHaveBeenCalledWith('id', id);
    expect(result.data).toBeNull();
    expect(result.error).toEqual(mockError);
  });
});
