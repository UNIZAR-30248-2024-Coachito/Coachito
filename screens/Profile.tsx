import React, { useEffect, useState } from 'react';
import { CircleUserRound, Dumbbell } from 'lucide-react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabaseClient from '@/api/supabaseClient';

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
  const { session, profile } = useUserInfo();
  const [workoutsDetails, setWorkoutsDetails] = useState<UserWorkoutsDetails>();
  const [chartData, setChartData] = useState<DataChartProps[]>([]);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await useFetchUserWorkouts(userId);
    console.log(data);
    console.log(error);
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
    if (session?.user?.id) {
      console.log(session.user.id);
      fetchUserProfile(session.user.id);
    }
  }, [session?.user?.id]);

  const buttons = ['Duración', 'Repeticiones', 'Volumen'];

  const handleLogout = async () => {
    try {
      // 1. Eliminar el JWT de AsyncStorage
      await AsyncStorage.removeItem('access_token');

      // 2. Eliminar el token de los encabezados de Axios (supabaseClient)
      supabaseClient.defaults.headers['Authorization'] = '';

      console.log('Cierre de sesión exitoso');
      // 3. Aquí puedes redirigir al usuario a la pantalla de inicio de sesión
      // Por ejemplo: navigate('/login') o cualquier otra lógica de redirección.
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <VStack className="items-center gap-4">
      <Button onPress={handleLogout}>
        <Text className="text-black">Cerrar Sesión</Text>
      </Button>
      <CircleUserRound color="#3b82f6" size={100} />

      <Text size="xl" bold>
        {profile?.username}
      </Text>

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
