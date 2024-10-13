import React from 'react';
import { ScrollView } from 'react-native';
import { VStack } from '../components/ui/vstack';
import '../styles.css';
import WorkoutCardResumeComponent from '@/components/workout/WorkoutCardResume';
import { useFetchDashboardWorkouts } from '@/hooks/dashboardHook';

const Dashboard: React.FC = () => {
  const { workoutResumes, loading, error } = useFetchDashboardWorkouts();

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
              showHeader={true}
            />
          ))}
      </VStack>
    </ScrollView>
  );
};

export default Dashboard;
