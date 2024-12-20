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
import { DataChartProps } from '@/components/shared/CustomAreaChart';
import { convertIntervalToMinutes } from '@/utils/interval';
import { formatToChartLabel } from '@/utils/date';

export interface UserWorkouts {
  workoutId: number;
  duration: string;
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
  const [chartData, setChartData] = useState<DataChartProps[]>([]);

  const fetchUserProfile = async () => {
    const { data, error } = await useFetchUserWorkouts(userId);

    if (!error) {
      setWorkoutsDetails(data!);

      const sortedWorkouts = [...data!.workouts].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const durationData =
        sortedWorkouts.map((workout) => ({
          value: convertIntervalToMinutes(workout.duration),
          label: formatToChartLabel(workout.created_at),
        })) || [];

      const repsData =
        sortedWorkouts.map((workout) => ({
          value: workout.repsCount,
          label: formatToChartLabel(workout.created_at),
        })) || [];

      const volumenData =
        sortedWorkouts.map((workout) => ({
          value: workout.volumen,
          label: formatToChartLabel(workout.created_at),
        })) || [];

      setChartData([
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
      ]);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const buttons = ['Duración', 'Repeticiones', 'Volumen'];

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
