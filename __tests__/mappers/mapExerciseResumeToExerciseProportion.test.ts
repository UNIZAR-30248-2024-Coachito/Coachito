import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';
import { mapToExerciseProportions } from '@/mappers/mapExerciseResumeToExerciseProportion';

describe('mapToExerciseProportions', () => {
  it('debería calcular correctamente la proporción para un solo grupo muscular', () => {
    const exerciseResumes: ExerciseResume[] = [
      {
        id: 1,
        name: 'Prueba',
        thumbnailUrl: '',
        restTime: null,
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        sets: [{ reps: 10, weight: 10 }],
      },
      {
        id: 2,
        name: 'Prueba2',
        thumbnailUrl: '',
        restTime: null,
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        sets: [{ reps: 10, weight: 10 }],
      },
    ];

    const result = mapToExerciseProportions(exerciseResumes);
    expect(result).toEqual([{ name: 'Pectorales', proportion: 100 }]);
  });

  it('debería calcular correctamente la proporción para múltiples grupos musculares', () => {
    const exerciseResumes: ExerciseResume[] = [
      {
        id: 1,
        name: 'Prueba',
        thumbnailUrl: '',
        restTime: null,
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        sets: [
          { reps: 10, weight: 10 },
          { reps: 10, weight: 10 },
        ],
      },
      {
        id: 2,
        name: 'Prueba2',
        thumbnailUrl: '',
        restTime: null,
        notes: '',
        primaryMuscleGroup: 'Abdominales',
        sets: [
          { reps: 10, weight: 10 },
          { reps: 10, weight: 10 },
        ],
      },
      {
        id: 3,
        name: 'Prueba3',
        thumbnailUrl: '',
        restTime: null,
        notes: '',
        primaryMuscleGroup: 'Glúteos',
        sets: [
          { reps: 10, weight: 10 },
          { reps: 10, weight: 10 },
        ],
      },
    ];

    const result = mapToExerciseProportions(exerciseResumes);
    expect(result).toEqual([
      { name: 'Pectorales', proportion: 33.33333333333333 },
      { name: 'Abdominales', proportion: 33.33333333333333 },
      { name: 'Glúteos', proportion: 33.33333333333333 },
    ]);
  });

  it('debería devolver proporciones correctas para grupos musculares con diferentes cantidades de series', () => {
    const exerciseResumes: ExerciseResume[] = [
      {
        id: 1,
        name: 'Prueba',
        thumbnailUrl: '',
        restTime: null,
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        sets: [
          { reps: 10, weight: 10 },
          { reps: 10, weight: 10 },
        ],
      },
      {
        id: 2,
        name: 'Prueba2',
        thumbnailUrl: '',
        restTime: null,
        notes: '',
        primaryMuscleGroup: 'Abdominales',
        sets: [
          { reps: 10, weight: 10 },
          { reps: 10, weight: 10 },
          { reps: 10, weight: 10 },
        ],
      },
      {
        id: 3,
        name: 'Prueba3',
        thumbnailUrl: '',
        restTime: null,
        notes: '',
        primaryMuscleGroup: 'Glúteos',
        sets: [
          { reps: 10, weight: 10 },
          { reps: 10, weight: 10 },
          { reps: 10, weight: 10 },
          { reps: 10, weight: 10 },
        ],
      },
    ];

    const result = mapToExerciseProportions(exerciseResumes);
    expect(result).toEqual([
      { name: 'Pectorales', proportion: 22.22222222222222 },
      { name: 'Abdominales', proportion: 33.33333333333333 },
      { name: 'Glúteos', proportion: 44.44444444444444 },
    ]);
  });

  it('debería manejar una lista vacía y devolver un array vacío', () => {
    const exerciseResumes: ExerciseResume[] = [];
    const result = mapToExerciseProportions(exerciseResumes);
    expect(result).toEqual([]);
  });

  it('debería manejar correctamente un total de series igual a cero', () => {
    const exerciseResumes: ExerciseResume[] = [
      {
        id: 1,
        name: 'Prueba',
        thumbnailUrl: '',
        restTime: null,
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        sets: [],
      },
      {
        id: 2,
        name: 'Prueba2',
        thumbnailUrl: '',
        restTime: null,
        notes: '',
        primaryMuscleGroup: 'Abdominales',
        sets: [],
      },
    ];

    const result = mapToExerciseProportions(exerciseResumes);
    expect(result).toEqual([
      { name: 'Pectorales', proportion: 0 },
      { name: 'Abdominales', proportion: 0 },
    ]);
  });
});
