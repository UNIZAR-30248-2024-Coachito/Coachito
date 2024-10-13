import React, { useState } from 'react';
import '../styles.css';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { ChevronDown, ChevronRight, ClipboardList } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import MyRoutinesCardResumeComponent from '@/components/myRoutines/MyRoutinesCardResume';
import { useFetchMyRoutinesWorkouts } from '@/hooks/myRoutinesHook';

const Routine: React.FC = () => {
  const { myRoutineResume, loading, error } = useFetchMyRoutinesWorkouts();
  const navigation = useNavigation<NavigationProps>();

  const [showRoutines, setShowRoutines] = useState(true);

  const toggleRoutines = () => {
    setShowRoutines((prev) => !prev);
  };

  return (
    <ScrollView className="flex-1">
      <Text className="text-xl font-bold ml-4 text-white">Rutinas</Text>
      <Button
        className="bg-zinc-900 m-4 p-2"
        onPress={() => navigation.navigate('AddRoutine')}
      >
        <ClipboardList color="white" />
        <Text className="text-white ml-4">Nueva Rutina</Text>
      </Button>

      <Button className="bg-transparent justify-start" onPress={toggleRoutines}>
        {showRoutines ? (
          <ChevronDown color="gray" />
        ) : (
          <ChevronRight color="gray" />
        )}
        <Text className="text-gray-400 ml-2">
          Mis Rutinas ({myRoutineResume?.length || 0})
        </Text>
      </Button>

      {showRoutines && (
        <VStack className="mr-4 ml-4 mb-4">
          {!loading &&
            !error &&
            myRoutineResume!.map((workout, index) => (
              <MyRoutinesCardResumeComponent key={index} {...workout} />
            ))}
        </VStack>
      )}
    </ScrollView>
  );
};

export default Routine;
