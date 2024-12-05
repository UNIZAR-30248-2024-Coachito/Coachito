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
import { useUserInfo } from '@/context/UserContext';
import { Text } from '../components/ui/text';

const Dashboard: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutCardResume[]>([]);
  const navigation = useNavigation<NavigationProps>();
  const { session } = useUserInfo();

  const fetchWorkouts = async (userId: string) => {
    const { data, error } = await useFetchDashboardWorkouts(userId);

    if (!error) {
      setWorkouts(data);
    } else {
      Alert.alert(
        '',
        'Se ha producido un error al obtener los entrenamientos.',
        [{ text: 'OK' }]
      );
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchWorkouts(session.user.id);
    }
  }, []);

  useEffect(() => {
    const routineDeletedListener = emitter.addListener(
      'workoutFinished',
      () => {
        if (session?.user?.id) {
          fetchWorkouts(session.user.id);
        }
        Alert.alert('', '¡Entrenamiento completado!', [{ text: 'OK' }]);
      }
    );

    if (session?.user?.id) {
      fetchWorkouts(session.user.id);
    }

    return () => {
      routineDeletedListener?.remove();
    };
  }, [navigation]);

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        {workouts.length === 0 ? (
          <Text className="text-center text-white mt-4">
            ¡¡¡Realiza tu primer entrenamiento!!!
          </Text>
        ) : (
          workouts!.map((workout, index) => (
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
          ))
        )}
      </VStack>
    </ScrollView>
  );
};

export default Dashboard;
