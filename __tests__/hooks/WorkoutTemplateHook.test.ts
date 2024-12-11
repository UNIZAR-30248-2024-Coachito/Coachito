import { supabase } from '@/api/supabaseClient';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';
import {
  useDeleteWorkoutTemplate,
  useFetchTemplateWorkouts,
  useCreateRoutine,
  useUpdateRoutine,
  useRoutineTitleExists,
} from '@/hooks/workoutTemplateHook';

jest.mock('@/api/supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

describe('workoutTemplateHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useDeleteWorkoutTemplate', () => {
    it('debe marcar un template como eliminado exitosamente', async () => {
      const mockResponse = { data: { id: 1 }, error: null };
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue(mockResponse),
        }),
      });

      const result = await useDeleteWorkoutTemplate(1);

      expect(supabase.from).toHaveBeenCalledWith('workout_templates');
      expect(result.data).toEqual(mockResponse.data);
      expect(result.error).toBeNull();
    });

    it('debe manejar errores al marcar un template como eliminado', async () => {
      const mockError = { message: 'Error updating template' };
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        }),
      });

      const result = await useDeleteWorkoutTemplate(1);

      expect(supabase.from).toHaveBeenCalledWith('workout_templates');
      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });

    it('debe manejar excepciones en el bloque try', async () => {
      (supabase.from as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await useDeleteWorkoutTemplate(1);
      expect(result.data).toBeNull();
      expect(result.error).not.toBeNull();
    });
  });

  describe('useFetchTemplateWorkouts', () => {
    it('debe obtener detalles de rutinas exitosamente', async () => {
      const mockResponse = { data: [{ id: 1 }], error: null };
      (supabase.rpc as jest.Mock).mockResolvedValue(mockResponse);

      const result = await useFetchTemplateWorkouts();

      expect(supabase.rpc).toHaveBeenCalledWith('get_routines_details');
      expect(result.data).toEqual(mockResponse.data);
      expect(result.error).toBeNull();
    });

    it('debe manejar errores al obtener detalles de rutinas', async () => {
      const mockError = { message: 'Error fetching routines' };
      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await useFetchTemplateWorkouts();

      expect(supabase.rpc).toHaveBeenCalledWith('get_routines_details');
      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });

    it('debe manejar excepciones en el bloque try', async () => {
      (supabase.rpc as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await useFetchTemplateWorkouts();
      expect(result.data).toBeNull();
      expect(result.error).not.toBeNull();
    });
  });

  describe('useCreateRoutine', () => {
    it('debe crear una rutina exitosamente', async () => {
      const exercises = [
        {
          id: 1,
          name: 'Flexiones',
          thumbnailUrl: 'Some url',
          primaryMuscleGroup: 'Pecho',
          sets: [{ reps: 10, weight: 20 }],
          notes: '',
          restTime: '30',
          targetReps: 10,
        },
      ];
      const mockInsertResponse = { data: [{ id: 1 }], error: null };

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'workout_templates') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue(mockInsertResponse),
            }),
          };
        }
        if (table === 'workouts') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue(mockInsertResponse),
            }),
          };
        }
        if (table === 'workout_exercises') {
          return {
            insert: jest.fn().mockResolvedValue({ error: null }),
          };
        }
        return null;
      });

      const result = await useCreateRoutine(
        'Routine Name',
        exercises,
        1,
        'user_1'
      );

      expect(supabase.from).toHaveBeenCalledWith('workout_templates');
      expect(supabase.from).toHaveBeenCalledWith('workouts');
      expect(supabase.from).toHaveBeenCalledWith('workout_exercises');
      expect(result.error).toBeNull();
    });

    it('debe manejar errores al crear una rutina', async () => {
      const exercises: ExerciseResume[] = [];
      const mockError = { message: 'Error inserting workout template' };

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        }),
      });

      const result = await useCreateRoutine(
        'Routine Name',
        exercises,
        1,
        'user_1'
      );

      expect(supabase.from).toHaveBeenCalledWith('workout_templates');
      expect(result.error).toEqual(mockError);
    });

    it('debe manejar errores al insertar en workouts', async () => {
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'workout_templates') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest
                .fn()
                .mockResolvedValue({ data: [{ id: 1 }], error: null }),
            }),
          };
        }
        if (table === 'workouts') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest
                .fn()
                .mockResolvedValue({ data: null, error: { message: 'Error' } }),
            }),
          };
        }
      });

      const result = await useCreateRoutine('Routine', [], 1, 'user_id');
      expect(result.error).not.toBeNull();
    });

    it('debe manejar errores al insertar en workout_exercises', async () => {
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'workout_templates') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest
                .fn()
                .mockResolvedValue({ data: [{ id: 1 }], error: null }),
            }),
          };
        }
        if (table === 'workouts') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest
                .fn()
                .mockResolvedValue({ data: [{ id: 2 }], error: null }),
            }),
          };
        }
        if (table === 'workout_exercises') {
          return {
            insert: jest
              .fn()
              .mockResolvedValue({ error: { message: 'Error' } }),
          };
        }
      });

      const exercises = [
        {
          id: 1,
          name: 'Flexiones',
          thumbnailUrl: 'Some URL',
          primaryMuscleGroup: 'Pecho',
          sets: [{ reps: 10, weight: 20 }],
          notes: '',
          restTime: '30',
          targetReps: 10,
        },
      ];
      const result = await useCreateRoutine('Routine', exercises, 1, 'user_id');
      expect(result.error).not.toBeNull();
    });

    it('debe manejar excepciones en el bloque try', async () => {
      (supabase.from as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await useCreateRoutine('Routine', [], 1, 'user_id');
      expect(result.error).not.toBeNull();
    });
  });

  describe('useUpdateRoutine', () => {
    it('debe actualizar una rutina exitosamente', async () => {
      const exercises: ExerciseResume[] = [];
      const mockInsertResponse = { data: [{ id: 1 }], error: null };

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'workout_templates') {
          return {
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        if (table === 'workouts') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue(mockInsertResponse),
            }),
          };
        }
        return null;
      });

      const result = await useUpdateRoutine(1, 'Updated Name', exercises);

      expect(supabase.from).toHaveBeenCalledWith('workout_templates');
      expect(supabase.from).toHaveBeenCalledWith('workouts');
      expect(result.error).toBeNull();
    });

    it('debe manejar errores al actualizar el nombre del template', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest
            .fn()
            .mockResolvedValue({ error: { message: 'Update error' } }),
        }),
      });

      const result = await useUpdateRoutine(1, 'New Name', []);
      expect(result.error).not.toBeNull();
    });

    it('debe manejar errores al insertar en workouts', async () => {
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'workout_templates') {
          return {
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        if (table === 'workouts') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest
                .fn()
                .mockResolvedValue({ data: null, error: { message: 'Error' } }),
            }),
          };
        }
      });

      const result = await useUpdateRoutine(1, 'New Name', []);
      expect(result.error).not.toBeNull();
    });

    it('debe manejar excepciones en el bloque try', async () => {
      (supabase.from as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await useUpdateRoutine(1, 'New Name', []);
      expect(result.error).not.toBeNull();
    });
  });

  describe('useRoutineTitleExists', () => {
    it('debe verificar si un título de rutina existe', async () => {
      const mockResponse = { data: true, error: null };
      (supabase.rpc as jest.Mock).mockResolvedValue(mockResponse);

      const result = await useRoutineTitleExists('Test Title', 1);

      expect(supabase.rpc).toHaveBeenCalledWith('routine_title_exists', {
        routine_title: 'Test Title',
        folder_id: 1,
      });
      expect(result.data).toBe(true);
      expect(result.error).toBeNull();
    });

    it('debe manejar errores de Supabase', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Error' },
      });

      const result = await useRoutineTitleExists('Test Title', 1);
      expect(result.data).toBeNull();
      expect(result.error).not.toBeNull();
    });

    it('debe manejar excepciones en el bloque try', async () => {
      (supabase.rpc as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const result = await useRoutineTitleExists('Test Title', 1);
      expect(result.data).toBeNull();
      expect(result.error).not.toBeNull();
    });
  });
});
