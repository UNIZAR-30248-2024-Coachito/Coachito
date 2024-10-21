import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { VStack } from '../components/ui/vstack';
import '../styles.css';
import WorkoutCardResumeComponent, {
  WorkoutCardResume,
} from '@/components/workout/WorkoutCardResume';
import { useFetchDashboardWorkouts } from '@/hooks/dashboardHook';

const Dashboard: React.FC = () => {
  const [dashboardWorkouts, setDashboardWorkouts] = useState<
    WorkoutCardResume[]
  >([]);

  const fetchDashboardWorkouts = async () => {
    const { workoutResumes, error: errorDashboardWorkouts } =
      await useFetchDashboardWorkouts();

    if (!errorDashboardWorkouts) {
      setDashboardWorkouts(workoutResumes!);
    }
  };

  useEffect(() => {
    fetchDashboardWorkouts();
  }, []);

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        {dashboardWorkouts!.map((workout, index) => (
          <WorkoutCardResumeComponent
            key={index}
            workoutHeaderResume={workout.workoutHeaderResume}
            workoutExercisesResume={workout.workoutExercisesResume}
          />
        ))}
      </VStack>
    </ScrollView>
  );
};

export default Dashboard;
