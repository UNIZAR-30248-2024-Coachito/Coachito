import React from 'react';
import { ScrollView } from 'react-native';
import { VStack } from '../components/ui/vstack';
import '../styles.css';
import WorkoutCardResumeComponent from '@/components/workout/WorkoutCardResume';
import { useFetchDashboardWorkouts } from '@/hooks/dashboardHook';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';

const Dashboard: React.FC = () => {
  const { workoutResumes, loading, error } = useFetchDashboardWorkouts();
  const navigation = useNavigation<NavigationProps>();

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        {!loading &&
          !error &&
          workoutResumes!.map((workout, index) => (
            <WorkoutCardResumeComponent
              key={index}
              workoutHeaderResume={workout.workoutHeaderResume}
              workoutExercisesResume={workout.workoutExercisesResume}
              onPress={() =>
                navigation.navigate('VerEntrenamiento', { workout })
              }
            />
          ))}
      </VStack>
    </ScrollView>
  );
};

export default Dashboard;
