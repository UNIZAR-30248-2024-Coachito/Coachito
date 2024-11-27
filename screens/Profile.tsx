import React, { useContext, useEffect, useState } from 'react';
import { CircleUserRound, Dumbbell, Moon } from 'lucide-react-native';
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
import { ThemeContext } from './App';
import { Pressable } from 'react-native';

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

interface ProfileProps {
  backgroundColor: string;
  textColor: string;
  blueColor: string;
  buttonColor: string;
}

const Profile: React.FC<ProfileProps> = ({
  backgroundColor,
  textColor,
  blueColor,
  buttonColor,
}) => {
  const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>();
  const userId = route.params.userId;
  const [workoutsDetails, setWorkoutsDetails] = useState<UserWorkoutsDetails>();
  const [chartData, setChartData] = useState<DataChartProps[]>([]);
  const { colorMode, toggleColorMode } = useContext(ThemeContext);

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
    <VStack style={{ backgroundColor }} className="items-center gap-4">
      <HStack className="flex-row justify-end gap-2 w-full mt-5 mr-10">
        <Pressable onPress={toggleColorMode}>
          <Moon color={colorMode === 'dark' ? '#ffffff' : '#000000'} />
        </Pressable>
      </HStack>
      <CircleUserRound color={blueColor} size={100} />

      {workoutsDetails && (
        <Text size="xl" bold>
          {workoutsDetails!.username}
        </Text>
      )}

      <HStack className="gap-2">
        <Dumbbell />
        {workoutsDetails && (
          <Text style={{ color: textColor }}>
            {workoutsDetails!.workoutsCount} entrenos realizados
          </Text>
        )}
      </HStack>

      <CustomBarChart
        data={chartData}
        buttons={buttons}
        buttonColor={buttonColor}
        textColor={textColor}
      />
    </VStack>
  );
};

export default Profile;
