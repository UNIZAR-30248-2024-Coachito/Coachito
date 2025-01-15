import React, { useContext, useState } from 'react';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
} from 'lucide-react-native';
import MyRoutinesCardResumeComponent, {
  MyRoutinesCardResume,
} from './MyRoutinesCardResume';
import { VStack } from '../ui/vstack';
import {
  useDeleteTemplateWorkoutGroupById,
  useEditTemplateWorkoutGroup,
} from '@/hooks/workoutTemplateGroupHook';
import { HStack } from '../ui/hstack';
import SlideUpBaseModal from '../shared/SlideUpBaseModal';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import PopupBaseModal from '../shared/PopupBaseModal';
import { Input, InputField } from '../ui/input';
import { emitter } from '@/utils/emitter';
import { Alert } from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';
import { MAX_LENGHT_TITLE } from '@/screens/AddRoutine';

export interface GroupedRoutines {
  groupId: number;
  groupName: string | null;
  routines: MyRoutinesCardResume[];
}

export interface GroupedRoutinesProps {
  groupedRoutine: GroupedRoutines;
}

const GroupedRoutinesResumeComponent: React.FC<GroupedRoutinesProps> = ({
  groupedRoutine,
}) => {
  const { colorMode } = useContext(ThemeContext);
  const navigation = useNavigation<NavigationProps>();
  const [showRoutines, setShowRoutines] = useState(true);
  const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isRenameGroupModalVisible, setIsRenameGroupModalVisible] =
    useState(false);
  const [newFolderName, setNewFolderName] = useState(groupedRoutine.groupName);

  const createRoutine = async () => {
    if (groupedRoutine.routines.length >= 7) {
      Alert.alert('', 'No puede añadir más de 7 rutinas por carpeta.');
      return;
    }

    navigation.navigate('AddRoutine', {
      exercises: [],
      groupId: groupedRoutine.groupId,
    });
  };

  const deleteGroup = async () => {
    const { error } = await useDeleteTemplateWorkoutGroupById(
      groupedRoutine.groupId
    );

    if (!error) {
      emitter.emit('groupDeleted');
    } else {
      Alert.alert('', 'Se ha producido un error eliminando la carpeta.');
    }
  };

  const updateGroup = async () => {
    const folderName = newFolderName?.trim();
    setIsRenameGroupModalVisible(false);

    if (folderName === '') {
      Alert.alert('', 'Por favor, introduce un nombre para la nueva carpeta.');
      return;
    }

    const { error } = await useEditTemplateWorkoutGroup(
      groupedRoutine.groupId,
      folderName!
    );

    if (!error) {
      setNewFolderName(folderName!);
      emitter.emit('groupRenamed');
    } else {
      setNewFolderName(groupedRoutine.groupName!);
      Alert.alert('', 'Se ha producido un error al renombrar la carpeta.');
    }
  };

  const componentsRenameGroupPopUpModal: React.ReactNode[] = [
    <Text
      key="1"
      className="text-xl font-bold text-center text-typography-0 mb-4"
    >
      Nuevo nombre de la carpeta
    </Text>,
    <Input key="2" className="mb-4">
      <InputField
        placeholder="Nuevo nombre"
        value={newFolderName!}
        onChangeText={(value) =>
          setNewFolderName(value.slice(0, MAX_LENGHT_TITLE))
        }
      />
    </Input>,
    <Button
      key="3"
      className="bg-blue-500 rounded-lg mb-4"
      onPress={updateGroup}
    >
      <Text className="text-white">Guardar</Text>
    </Button>,
    <Button
      key="4"
      className="bg-tertiary-500 rounded-lg"
      onPress={() => {
        setIsRenameGroupModalVisible(false);
      }}
    >
      <Text className="text-white">Cancelar</Text>
    </Button>,
  ];

  const buttonsSlideUpModal: React.ReactNode[] = [
    <Button
      key="1"
      className="bg-transparent gap-2"
      onPress={() => {
        setIsSlideUpModalVisible(false);
        setIsRenameGroupModalVisible(true);
      }}
    >
      <Pencil color={`${colorMode === 'light' ? 'black' : 'white'}`} />
      <Text className="text-typography-0">Renombrar Carpeta</Text>
    </Button>,
    <Button
      key="2"
      className="bg-transparent gap-2"
      onPress={() => createRoutine()}
    >
      <Plus color={`${colorMode === 'light' ? 'black' : 'white'}`} />
      <Text className="text-typography-0">Agregar nueva rutina</Text>
    </Button>,
    <Button
      key="3"
      className="bg-transparent gap-2"
      onPress={() => {
        setIsDeleteModalVisible(true);
        setIsSlideUpModalVisible(false);
      }}
    >
      <Trash color="red" />
      <Text className="text-red-600">Eliminar Carpeta</Text>
    </Button>,
  ];

  const componentsDeleteGroupPopUpModal: React.ReactNode[] = [
    <Text
      key="1"
      className="text-xl font-bold text-center text-typography-0 pb-8"
    >
      ¿Está seguro de que quiere eliminar la carpeta?
    </Text>,
    <Button
      testID="delete-button"
      key="2"
      className="bg-background-50 rounded-lg mb-4"
      onPress={() => {
        setIsDeleteModalVisible(false);
        deleteGroup();
      }}
    >
      <Text className="text-white">Eliminar carpeta</Text>
    </Button>,
    <Button
      key="3"
      className="bg-tertiary-500 rounded-lg"
      onPress={() => {
        setIsDeleteModalVisible(false);
      }}
    >
      <Text className="text-white">Cancelar</Text>
    </Button>,
  ];

  return (
    <VStack>
      <HStack className="justify-between">
        <Button
          className="bg-transparent justify-start"
          onPress={() => {
            setShowRoutines(!showRoutines);
          }}
        >
          {showRoutines ? (
            <ChevronDown color="gray" />
          ) : (
            <ChevronRight color="gray" />
          )}
          <Text className="text-gray-400 ml-2">
            {groupedRoutine.groupName ?? 'Mis Rutinas'} (
            {groupedRoutine.routines!.length || 0})
          </Text>
        </Button>

        {groupedRoutine.groupName != 'Mis Rutinas' && (
          <Button
            testID="slideup-modal"
            className="bg-transparent"
            onPress={() => {
              setIsSlideUpModalVisible(true);
            }}
          >
            <MoreHorizontal
              color={`${colorMode === 'light' ? 'black' : 'white'}`}
            />
          </Button>
        )}
      </HStack>

      {showRoutines &&
        groupedRoutine.routines!.map((routine, index) => (
          <MyRoutinesCardResumeComponent
            key={index}
            routineCardResume={routine}
          />
        ))}

      <SlideUpBaseModal
        buttons={buttonsSlideUpModal}
        title={groupedRoutine.groupName!}
        isVisible={isSlideUpModalVisible}
        setIsModalVisible={setIsSlideUpModalVisible}
      />

      <PopupBaseModal
        components={componentsDeleteGroupPopUpModal}
        isVisible={isDeleteModalVisible}
        setIsModalVisible={setIsDeleteModalVisible}
      />

      <PopupBaseModal
        components={componentsRenameGroupPopUpModal}
        isVisible={isRenameGroupModalVisible}
        setIsModalVisible={setIsRenameGroupModalVisible}
      />
    </VStack>
  );
};

export default GroupedRoutinesResumeComponent;
