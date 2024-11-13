import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { VStack } from '../components/ui/vstack';
import '../styles.css';
import WorkoutCardResumeComponent, {
  WorkoutCardResume,
} from '@/components/workout/WorkoutCardResume';
import { useFetchDashboardWorkouts } from '@/hooks/dashboardHook';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import { emitter } from '@/utils/emitter';

const Dashboard: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutCardResume[]>([]);
  const navigation = useNavigation<NavigationProps>();

  const fetchWorkouts = async () => {
    const { data, error } = await useFetchDashboardWorkouts();

    if (!error) {
      setWorkouts(data);
    } else {
      alert('Se ha producido un error al obtener los entrenamientos.');
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    const routineDeletedListener = emitter.addListener(
      'workoutFinished',
      () => {
        fetchWorkouts();
        alert('¡Entrenamiento completado!');
      }
    );

    fetchWorkouts();

    return () => {
      routineDeletedListener?.remove();
    };
  }, [navigation]);

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        {workouts!.map((workout, index) => (
          <WorkoutCardResumeComponent
            key={index}
            workout_header_resume={workout.workout_header_resume}
            workout_exercises_resume={workout.workout_exercises_resume}
            onPress={() =>
              navigation.navigate('DetailsWorkout', {
                workoutId: workout.workout_header_resume.workoutId,
              })
            }
          />
        ))}
      </VStack>
    </ScrollView>
  );
};

export default Dashboard;
