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

const Dashboard: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutCardResume[]>([]);
  const navigation = useNavigation<NavigationProps>();

  const fetchWorkouts = async () => {
    const { workoutResumes, error: errorRoutines } =
      await useFetchDashboardWorkouts();

    if (!errorRoutines) {
      setWorkouts(workoutResumes!);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        {workouts!.map((workout, index) => (
          <WorkoutCardResumeComponent
            key={index}
            workoutHeaderResume={workout.workoutHeaderResume}
            workoutExercisesResume={workout.workoutExercisesResume}
            onPress={() => navigation.navigate('VerEntrenamiento', { workout })}
          />
        ))}
      </VStack>
    </ScrollView>
  );
};

export default Dashboard;
