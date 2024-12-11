import React, { useContext, useEffect, useState } from 'react';
import {
  CircleUserRound,
  Dumbbell,
  LogOut,
  Moon,
  Settings,
} from 'lucide-react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useFetchUserWorkouts } from '@/hooks/userHook';
import { HStack } from '@/components/ui/hstack';
import CustomBarChart from '@/components/shared/CustomBarChart';
import { DataChartProps } from '@/components/shared/CustomAreaChart';
import { convertIntervalToMinutes } from '@/utils/interval';
import { formatToChartLabel } from '@/utils/date';
import { Button } from '@/components/ui/button';
import { useUserInfo } from '@/context/UserContext';
import { supabase } from '@/api/supabaseClient';
import { Menu, MenuItem } from '@/components/ui/menu';
import { ThemeContext } from '@/context/ThemeContext';

export interface UserWorkouts {
  workoutId: number;
  duration: string;
  repsCount: number;
  volumen: number;
  created_at: string;
}

export interface UserWorkoutsDetails {
  workoutsCount: number;
  workouts: UserWorkouts[];
}

const Profile: React.FC = () => {
  const { colorMode, toggleColorMode } = useContext(ThemeContext);
  const { profile } = useUserInfo();
  const [workoutsDetails, setWorkoutsDetails] = useState<UserWorkoutsDetails>();
  const [chartData, setChartData] = useState<DataChartProps[]>([]);

  const fetchUserProfile = async () => {
    const { data, error } = await useFetchUserWorkouts();
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
  }, []);

  const buttons = ['Duración', 'Repeticiones', 'Volumen'];

  return (
    <VStack className="gap-4">
      <HStack className="justify-end mt-4">
        <Menu
          placement="bottom right"
          trigger={({ ...triggerProps }) => (
            <Button {...triggerProps} className="bg-transparent">
              <Settings
                color={`${colorMode === 'light' ? 'black' : 'white'}`}
                size={30}
              />
            </Button>
          )}
        >
          <MenuItem
            key="themeToggle"
            onPress={toggleColorMode}
            textValue="Cambiar Tema"
          >
            <HStack className="items-center gap-2">
              <Moon color={`${colorMode === 'light' ? 'black' : 'white'}`} />
              <Text>
                Cambiar a {colorMode === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
              </Text>
            </HStack>
          </MenuItem>
          <MenuItem
            key="logout"
            onPress={() => supabase.auth.signOut()}
            textValue="Cerrar Sesión"
          >
            <HStack className="items-center gap-2">
              <LogOut color={`${colorMode === 'light' ? 'black' : 'white'}`} />
              <Text>Cerrar Sesión</Text>
            </HStack>
          </MenuItem>
        </Menu>
      </HStack>

      <VStack className="items-center gap-4">
        <CircleUserRound color="#3b82f6" size={100} />

        <Text size="xl" bold className="mb-4">
          {profile?.username}
        </Text>

        <HStack className="gap-2">
          <Dumbbell color={`${colorMode === 'light' ? 'black' : 'white'}`} />
          {workoutsDetails && (
            <Text>{workoutsDetails!.workoutsCount} entrenos realizados</Text>
          )}
          <Dumbbell color={`${colorMode === 'light' ? 'black' : 'white'}`} />
        </HStack>

        <CustomBarChart data={chartData} buttons={buttons} />
      </VStack>
    </VStack>
  );
};

export default Profile;
