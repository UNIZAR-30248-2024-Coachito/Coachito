import React, { useEffect, useState } from 'react';
import '../styles.css';
import { CircleUserRound, Dumbbell } from 'lucide-react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useFetchUserWorkouts } from '@/hooks/userHook';
import { HStack } from '@/components/ui/hstack';
import CustomBarChart from '@/components/shared/CustomBarChart';

export interface UserWorkouts {
  workoutId: number;
  duration: number;
  repsCount: number;
  volumen: number;
  created_at: string;
}

export interface UserWorkoutsDetails {
  username: string;
  workoutsCount: number;
  workouts: UserWorkouts[];
}

const Profile: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>();
  const userId = route.params.userId;
  const [workoutsDetails, setWorkoutsDetails] = useState<UserWorkoutsDetails>();

  const fetchUserProfile = async () => {
    const { userWorkouts, error: errorUserWorkouts } =
      await useFetchUserWorkouts(userId);

    if (!errorUserWorkouts) {
      setWorkoutsDetails(userWorkouts!);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const durationData =
    workoutsDetails?.workouts.map((workout) => ({
      value: workout.duration,
      label: workout.created_at,
    })) || [];

  const repsData =
    workoutsDetails?.workouts.map((workout) => ({
      value: workout.repsCount,
      label: workout.created_at,
    })) || [];

  const volumenData =
    workoutsDetails?.workouts.map((workout) => ({
      value: workout.volumen,
      label: workout.created_at,
    })) || [];

  const chartData = [
    {
      dataPoints: durationData,
      dataTotal: `${durationData.reduce((sum, point) => sum + point.value, 0)} min`,
    },
    {
      dataPoints: repsData,
      dataTotal: `${repsData.reduce((sum, point) => sum + point.value, 0)} reps`,
    },
    {
      dataPoints: volumenData,
      dataTotal: `${volumenData.reduce((sum, point) => sum + point.value, 0)} kg`,
    },
  ];

  const buttons = ['Duración', 'Reps', 'Volumen'];

  return (
    <VStack className="items-center gap-4">
      <CircleUserRound color="#3b82f6" size={100} />

      {workoutsDetails && (
        <Text size="xl" bold>
          {workoutsDetails!.username}
        </Text>
      )}

      <HStack className="gap-2">
        <Dumbbell />
        {workoutsDetails && (
          <Text>{workoutsDetails!.workoutsCount} entrenos realizados</Text>
        )}
      </HStack>

      <CustomBarChart data={chartData} buttons={buttons} />
    </VStack>
  );
};

export default Profile;
