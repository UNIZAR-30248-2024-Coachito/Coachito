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
import { useUserInfo } from '@/context/UserContext';

export interface Group {
  id: number;
  name: string;
}

interface RoutineProps {
  backgroundColorBoton: string;
  textColor: string;
  backgroundColorPopUp: string;
  backgroundColor: string;
  blueColor: string;
  redColor: string;
  buttonColor: string;
}

const Routine: React.FC<RoutineProps> = ({
  backgroundColorBoton,
  textColor,
  backgroundColorPopUp,
  backgroundColor,
  blueColor,
  redColor,
  buttonColor,
}) => {
  const navigation = useNavigation<NavigationProps>();
  const { session } = useUserInfo();
  const [routines, setRoutines] = useState<GroupedRoutines[]>([]);
  const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
  const [newFolderInputValue, setNewFolderInputValue] = useState('');

  const fetchRoutinesAndGroups = async () => {
    const { data, error } = await useFetchTemplateWorkouts();

    if (!error) {
      if (data && data.length > 0) {
        setRoutines(data);
      } else {
        setRoutines([]);
      }
    } else {
      Alert.alert('', 'Se ha producido un error al obtener las rutinas.');
    }
  };

  useEffect(() => {
    const routineDeletedListener = emitter.addListener('routineDeleted', () => {
      fetchRoutinesAndGroups();

      Alert.alert('', '¡Rutina eliminada correctamente!');
    });
    const routineRenamedListener = emitter.addListener('routineRenamed', () => {
      fetchRoutinesAndGroups();

      Alert.alert('', '¡Rutina editada correctamente!');
    });
    const routineAddedListener = emitter.addListener('routineAdded', () => {
      fetchRoutinesAndGroups();

      Alert.alert('', '¡Rutina creada correctamente!');
    });

    const groupCreatedListener = emitter.addListener('groupCreated', () => {
      fetchRoutinesAndGroups();

      Alert.alert('', '¡Carpeta creada correctamente!');
    });
    const groupRenamedListener = emitter.addListener('groupRenamed', () => {
      fetchRoutinesAndGroups();

      Alert.alert('', '¡Carpeta editada correctamente!');
    });
    const groupDeletedListener = emitter.addListener('groupDeleted', () => {
      fetchRoutinesAndGroups();

      Alert.alert('', '¡Carpeta eliminada correctamente!');
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
      Alert.alert('', 'No puede añadir más de 7 rutinas.');
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
      Alert.alert('', 'Por favor, introduce un nombre para la nueva carpeta.');
      return;
    }

    if (!session?.user?.id) {
      return 'Error con la autenticacion';
    }

    const { error } = await useCreateTemplateWorkoutGroup(
      folderName,
      session.user.id
    );

    if (!error) {
      fetchRoutinesAndGroups();
      emitter.emit('groupCreated');
    } else {
      Alert.alert('', 'Se ha producido un error al crear el nuevo grupo.');
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
      style={{ backgroundColor: blueColor }}
      className="rounded-lg mb-4"
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
      <VStack className="p-4" style={{ backgroundColor: backgroundColor }}>
        <Text style={{ color: textColor }} className="text-xl font-bold mb-4">
          Rutinas
        </Text>

        <HStack className="mb-4">
          <Button
            style={{ backgroundColor: backgroundColorBoton }}
            onPress={() => createRoutine()}
          >
            <ClipboardList color={textColor} />
            <Text style={{ color: textColor }} className="ml-2">
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
                    'Solo se pueden tener 10 carpetas por usuario.'
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

        {routines.length === 2 && routines[1].routines.length === 0 ? (
          <Text className="text-center text-white mt-4">
            No tiene rutinas disponibles
          </Text>
        ) : (
          routines
            .filter(
              (routine) =>
                !(routine.groupId === null && routine.groupName === 'No Group')
            )
            .map((routine, index) => (
              <GroupedRoutinesResumeComponent
                background={backgroundColor}
                backgroundColor={backgroundColorBoton}
                textColor={textColor}
                backgrounColorPopUp={backgroundColorPopUp}
                key={index}
                groupedRoutine={routine}
                blueColor={blueColor}
                redColor={redColor}
                buttonColor={buttonColor}
              />
            ))
        )}

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
