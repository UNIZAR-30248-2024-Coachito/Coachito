import React from 'react';
import '../styles.css';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { ClipboardList, FolderPlus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { useFetchMyRoutinesWorkouts } from '@/hooks/myRoutinesHook';
import { HStack } from '@/components/ui/hstack';
import GroupedRoutinesResumeComponent from '@/components/myRoutines/GroupedRoutinesResume';

const Routine: React.FC = () => {
  const { myRoutineResume, loading, error } = useFetchMyRoutinesWorkouts();
  const navigation = useNavigation<NavigationProps>();

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        <Text className="text-xl font-bold text-white mb-4">Rutinas</Text>

        <HStack className="mb-4">
          <Button
            className="bg-zinc-900"
            onPress={() => navigation.navigate('AddRoutine')}
          >
            <ClipboardList color="white" />
            <Text className="text-white ml-2">Nueva Rutina</Text>
          </Button>

          <Button
            className="bg-zinc-900 ml-4"
            //onPress={() => navigation.navigate('AddFolder')}
          >
            <FolderPlus color="white" />
            <Text className="text-white ml-2">Nueva Carpeta</Text>
          </Button>
        </HStack>
        {!loading &&
          !error &&
          myRoutineResume!.map((routine, index) => (
            <GroupedRoutinesResumeComponent
              key={index}
              groupName={routine.groupName}
              routines={routine.routines}
            />
          ))}
      </VStack>
    </ScrollView>
  );
};

export default Routine;
