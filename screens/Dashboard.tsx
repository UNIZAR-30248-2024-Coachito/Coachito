import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { VStack } from '../components/ui/vstack';
import WorkoutCardResumeComponent, {
  WorkoutCardResume,
} from '@/components/workout/WorkoutCardResume';
import { useFetchDashboardWorkouts } from '@/hooks/dashboardHook';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import { emitter } from '@/utils/emitter';
import { Text } from '../components/ui/text';

interface DashboardProps {
  backgroundColor: string;
  backgroundColorEntrenamiento: string;
  textColor: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  backgroundColor,
  backgroundColorEntrenamiento,
  textColor,
}) => {
  const [workouts, setWorkouts] = useState<WorkoutCardResume[]>([]);
  const navigation = useNavigation<NavigationProps>();

  const fetchWorkouts = async () => {
    const { data, error } = await useFetchDashboardWorkouts();

    if (!error) {
      setWorkouts(data);
    } else {
      Alert.alert(
        '',
        'Se ha producido un error al obtener los entrenamientos.'
      );
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

        Alert.alert('', '¡Entrenamiento completado!');
      }
    );

    fetchWorkouts();

    return () => {
      routineDeletedListener?.remove();
    };
  }, [navigation]);

  return (
    <ScrollView className="flex-1">
      <VStack className={`p-4 ${backgroundColor}`}>
        {workouts.length === 0 ? (
          <Text className="text-center text-white mt-4">
            ¡¡¡Realiza tu primer entrenamiento!!!
          </Text>
        ) : (
          workouts!.map((workout, index) => (
            <WorkoutCardResumeComponent
              backgroundColor={backgroundColorEntrenamiento}
              textColor={textColor}
              key={index}
              workout_header_resume={workout.workout_header_resume}
              workout_exercises_resume={workout.workout_exercises_resume}
              onPress={() =>
                navigation.navigate('DetailsWorkout', {
                  workoutId: workout.workout_header_resume.workoutId,
                  textColor: textColor,
                  backgroundColor: backgroundColor,
                  backgroundColorEntrenamiento: backgroundColorEntrenamiento,
                })
              }
            />
          ))
        )}
      </VStack>
    </ScrollView>
  );
};

export default Dashboard;
