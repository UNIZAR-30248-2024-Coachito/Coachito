import React, { useContext, useEffect, useState } from 'react';
import {
  CircleUserRound,
  LogOut,
  MonitorPlay,
  Moon,
  PlayCircle,
  Settings,
  ChartColumn,
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
import { Alert, Linking, ScrollView } from 'react-native';
import { Divider } from '@/components/ui/divider';

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

  const handleVideoNavigation = async (videoUrl: string) => {
    try {
      await Linking.openURL(videoUrl);
    } catch (error) {
      console.log(error);
      Alert.alert('', 'No se ha podido acceder al archivo');
    }
  };

  const buttons = ['Duración', 'Repeticiones', 'Volumen'];

  return (
    <ScrollView className="gap-4 p-4">
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

      <VStack className="items-center gap-4 mb-4">
        <CircleUserRound color="#3b82f6" size={100} />

        <Text size="xl" bold className="mb-4">
          {profile?.username}
        </Text>
      </VStack>

      <Divider className="my-0.5 mb-4" />

      <VStack className="justify-start mb-4">
        <HStack className="gap-2">
          <MonitorPlay color={`${colorMode === 'light' ? 'black' : 'white'}`} />
          <Text size="xl" bold className="mb-4">
            Video Tutoriales
          </Text>
        </HStack>
        <HStack className="items-center">
          <Text>Rutinas</Text>
          <Button
            className="gap-2 bg-transparent"
            onPress={() =>
              handleVideoNavigation(
                'https://drive.google.com/file/d/1LdgN4WkF-HLxCymZLmHRRW3HErUkdhI9/view?usp=drive_link'
              )
            }
          >
            <PlayCircle color="#3b82f6" />
          </Button>
        </HStack>
        <HStack className="items-center">
          <Text>Entrenamientos</Text>
          <Button
            className="gap-2 bg-transparent"
            onPress={() =>
              handleVideoNavigation(
                'https://drive.google.com/file/d/1kEO48K-X74cZb5NhtgkwgTxf2aowP7hc/view?usp=drive_link'
              )
            }
          >
            <PlayCircle color="#3b82f6" />
          </Button>
        </HStack>
      </VStack>

      <Divider className="my-0.5 mb-4" />

      <VStack className="justify-start gap-4 mb-4">
        <HStack className="gap-2">
          <ChartColumn color={`${colorMode === 'light' ? 'black' : 'white'}`} />
          <Text size="xl" bold>
            Estadísticas
          </Text>
        </HStack>

        {workoutsDetails && (
          <Text>Entrenos realizados: {workoutsDetails!.workoutsCount}</Text>
        )}
        <CustomBarChart data={chartData} buttons={buttons} />
      </VStack>
    </ScrollView>
  );
};

export default Profile;
