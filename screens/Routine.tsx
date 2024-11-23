import React, { useState, useEffect } from 'react';
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
import { Alert } from 'react-native';

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
    } else {
      Alert.alert('', 'Se ha producido un error al obtener las rutinas.', [
        { text: 'OK' },
      ]);
    }
  };

  useEffect(() => {
    const routineDeletedListener = emitter.addListener('routineDeleted', () => {
      fetchRoutinesAndGroups();
      Alert.alert('', '¡Rutina eliminada correctamente!', [{ text: 'OK' }]);
    });
    const routineRenamedListener = emitter.addListener('routineRenamed', () => {
      fetchRoutinesAndGroups();
      Alert.alert('', '¡Rutina editada correctamente!', [{ text: 'OK' }]);
    });
    const routineAddedListener = emitter.addListener('routineAdded', () => {
      fetchRoutinesAndGroups();
      Alert.alert('', '¡Rutina creada correctamente!', [{ text: 'OK' }]);
    });

    const groupCreatedListener = emitter.addListener('groupCreated', () => {
      fetchRoutinesAndGroups();
      Alert.alert('', '¡Carpeta creada correctamente!', [{ text: 'OK' }]);
    });
    const groupRenamedListener = emitter.addListener('groupRenamed', () => {
      fetchRoutinesAndGroups();
      Alert.alert('', '¡Carpeta editada correctamente!', [{ text: 'OK' }]);
    });
    const groupDeletedListener = emitter.addListener('groupDeleted', () => {
      fetchRoutinesAndGroups();
      Alert.alert('', '¡Carpeta eliminada correctamente!', [{ text: 'OK' }]);
    });

    fetchRoutinesAndGroups();

    return () => {
      routineDeletedListener?.remove();
      routineRenamedListener?.remove();
      routineAddedListener?.remove();
      groupCreatedListener?.remove();
      groupRenamedListener?.remove();
      groupDeletedListener?.remove();
    };
  }, [navigation]);

  const createRoutine = () => {
    const folderRoutines = routines.find((routine) => routine.groupId === null);

    if (folderRoutines && folderRoutines.routines.length >= 7) {
      Alert.alert('', 'No puede añadir más de 7 rutinas.', [{ text: 'OK' }]);
      return;
    }

    navigation.navigate('AddRoutine', {
      exercises: [],
      groupId: 0,
    });
  };

  const createGroup = async () => {
    const folderName = newFolderInputValue.trim();
    setIsNewGroupModalVisible(false);
    setNewFolderInputValue('');

    if (folderName === '') {
      Alert.alert('', 'Por favor, introduce un nombre para la nueva carpeta.', [
        { text: 'OK' },
      ]);
      return;
    }

    const { error } = await useCreateTemplateWorkoutGroup(folderName);
    if (!error) {
      fetchRoutinesAndGroups();
      emitter.emit('groupCreated');
    } else {
      Alert.alert('', 'Se ha producido un error al crear el nuevo grupo.', [
        { text: 'OK' },
      ]);
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
          <Button className="bg-zinc-900" onPress={() => createRoutine()}>
            <ClipboardList color="white" />
            <Text className="text-white ml-2">Nueva Rutina</Text>
          </Button>

          <VStack>
            <Button
              className="bg-zinc-900 ml-4"
              onPress={() => {
                if (routines.length > 10) {
                  Alert.alert(
                    '',
                    'Solo se pueden tener 10 carpetas por usuario.',
                    [{ text: 'OK' }]
                  );
                } else {
                  setIsNewGroupModalVisible(true);
                }
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
