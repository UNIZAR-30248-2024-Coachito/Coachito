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

interface RoutineProps {
  backgroundColorBoton: string;
  textColor: string;
  backgroundColorPopUp: string;
}

const Routine: React.FC<RoutineProps> = ({
  backgroundColorBoton,
  textColor,
  backgroundColorPopUp,
}) => {
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
    <Text
      style={{ color: textColor }}
      key="1"
      className="text-xl font-bold text-center text-white mb-4"
    >
      Crear nueva carpeta
    </Text>,
    <Input
      key="2"
      style={{ backgroundColor: backgroundColorBoton }}
      className="mb-4"
    >
      <InputField
        placeholder="Nueva carpeta"
        value={newFolderInputValue}
        onChangeText={setNewFolderInputValue}
      />
    </Input>,
    <Button
      key="3"
      style={{ color: '#3b82f6' }}
      className="bg-blue-500 rounded-lg mb-4"
      onPress={createGroup}
    >
      <Text style={{ color: textColor }}>Guardar</Text>
    </Button>,
    <Button
      style={{ backgroundColor: backgroundColorBoton }}
      key="4"
      className="rounded-lg"
      onPress={() => {
        setIsNewGroupModalVisible(false);
      }}
    >
      <Text style={{ color: textColor }}>Cancelar</Text>
    </Button>,
  ];

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        <Text className="text-xl font-bold text-black mb-4">Rutinas</Text>

        <HStack className="mb-4">
          <Button
            style={{ backgroundColor: backgroundColorBoton }}
            onPress={() => createRoutine()}
          >
            <ClipboardList color={textColor} />
            <Text style={{ color: textColor }} className="text-white ml-2">
              Nueva Rutina
            </Text>
          </Button>

          <VStack>
            <Button
              style={{ backgroundColor: backgroundColorBoton }}
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
              <FolderPlus color={textColor} />
              <Text style={{ color: textColor }} className="ml-2">
                Nueva Carpeta
              </Text>
            </Button>
          </VStack>
        </HStack>

        {routines!.map((routine, index) => (
          <GroupedRoutinesResumeComponent
            backgroundColor={backgroundColorBoton}
            textColor={textColor}
            backgrounColorPopUp={backgroundColorPopUp}
            key={index}
            groupedRoutine={routine}
          />
        ))}

        <PopupBaseModal
          backgroundColor={backgroundColorPopUp}
          components={newFolderComponentsPopUpModal}
          isVisible={isNewGroupModalVisible}
          setIsModalVisible={setIsNewGroupModalVisible}
        />
      </VStack>
    </ScrollView>
  );
};

export default Routine;
