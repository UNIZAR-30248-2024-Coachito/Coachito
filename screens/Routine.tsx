import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import '../styles.css';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { ClipboardList, FolderPlus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { useFetchTemplateWorkouts } from '@/hooks/workoutTemplateHook';
import { HStack } from '@/components/ui/hstack';
import GroupedRoutinesResumeComponent, {
  GroupedRoutines,
} from '@/components/routine/GroupedRoutinesResume';
import PopupBaseModal from '@/components/shared/PopupBaseModal';
import { Input, InputField } from '@/components/ui/input';
import { useCreateTemplateWorkoutGroup } from '@/hooks/workoutTemplateGroupHook';
import { emitter } from '@/utils/emitter';

export interface Group {
  id: number;
  name: string;
}

const Routine: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [routines, setRoutines] = useState<GroupedRoutines[]>([]);
  const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
  const [newFolderInputValue, setNewFolderInputValue] = useState('');

  const fetchRoutinesAndGroups = async () => {
    const { data, error } = await useFetchTemplateWorkouts();

    if (!error) {
      setRoutines(data!);
    }
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'Aceptar' }]);
  };

  useEffect(() => {
    const routineDeletedListener = emitter.addListener('routineDeleted', () => {
      fetchRoutinesAndGroups();
      showAlert(
        '¡Rutina Eliminada!',
        'Se ha eliminado la rutina correctamente.'
      );
    });
    const routineRenamedListener = emitter.addListener('routineRenamed', () => {
      fetchRoutinesAndGroups();
      showAlert('¡Rutina Editada!', 'Se ha editado la rutina correctamente.');
    });
    const routineAddedListener = emitter.addListener('routineAdded', () => {
      fetchRoutinesAndGroups();
      showAlert('¡Rutina Creada!', 'Se ha creado la rutina correctamente.');
    });

    fetchRoutinesAndGroups();

    return () => {
      routineDeletedListener.remove();
      routineRenamedListener.remove();
      routineAddedListener.remove();
    };
  }, [navigation]);

  const createGroup = async () => {
    const folderName = newFolderInputValue.trim();
    setIsNewGroupModalVisible(false);
    setNewFolderInputValue('');

    if (folderName === '') {
      alert('Por favor, introduce un nombre para la nueva carpeta.');
      return;
    }

    const { error } = await useCreateTemplateWorkoutGroup(folderName);
    if (!error) {
      fetchRoutinesAndGroups();
    }
  };

  const newFolderComponentsPopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white mb-4">
      Crear nueva carpeta
    </Text>,
    <Input key="2" className="mb-4">
      <InputField
        placeholder="Nueva carpeta"
        value={newFolderInputValue}
        onChangeText={setNewFolderInputValue}
      />
    </Input>,
    <Button
      key="3"
      className="bg-blue-500 rounded-lg mb-4"
      onPress={createGroup}
    >
      <Text className="text-white">Guardar</Text>
    </Button>,
    <Button
      key="4"
      className="bg-zinc-700 rounded-lg"
      onPress={() => {
        setIsNewGroupModalVisible(false);
      }}
    >
      <Text className="text-white">Cancelar</Text>
    </Button>,
  ];

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        <Text className="text-xl font-bold text-white mb-4">Rutinas</Text>

        <HStack className="mb-4">
          <Button
            className="bg-zinc-900"
            onPress={() =>
              navigation.navigate('AddRoutine', {
                exercises: [],
                groupId: 0,
              })
            }
          >
            <ClipboardList color="white" />
            <Text className="text-white ml-2">Nueva Rutina</Text>
          </Button>

          <VStack>
            <Button
              className="bg-zinc-900 ml-4"
              onPress={() => {
                setIsNewGroupModalVisible(true);
              }}
            >
              <FolderPlus color="white" />
              <Text className="text-white ml-2">Nueva Carpeta</Text>
            </Button>
          </VStack>
        </HStack>

        {routines!.map((routine, index) => (
          <GroupedRoutinesResumeComponent
            key={index}
            groupedRoutine={routine}
          />
        ))}

        <PopupBaseModal
          components={newFolderComponentsPopUpModal}
          isVisible={isNewGroupModalVisible}
          setIsModalVisible={setIsNewGroupModalVisible}
        />
      </VStack>
    </ScrollView>
  );
};

export default Routine;
