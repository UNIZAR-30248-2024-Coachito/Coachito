import React, { useState } from 'react';
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

export interface GroupedRoutines {
  groupId: number;
  groupName: string | null;
  routines: MyRoutinesCardResume[];
}

export interface GroupedRoutinesProps {
  backgroundColor: string;
  textColor: string;
  backgrounColorPopUp: string;
  groupedRoutine: GroupedRoutines;
}

const GroupedRoutinesResumeComponent: React.FC<GroupedRoutinesProps> = ({
  textColor,
  backgroundColor,
  backgrounColorPopUp,
  groupedRoutine,
}) => {
  const navigation = useNavigation<NavigationProps>();
  const [showRoutines, setShowRoutines] = useState(true);
  const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isRenameGroupModalVisible, setIsRenameGroupModalVisible] =
    useState(false);
  const [newFolderName, setNewFolderName] = useState(
    groupedRoutine.groupName ?? ''
  );

  const createRoutine = async () => {
    if (groupedRoutine.routines.length >= 7) {
      Alert.alert('', 'No puede añadir más de 7 rutinas por carpeta.', [
        { text: 'OK' },
      ]);
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
      Alert.alert('', 'Se ha producido un error eliminando la carpeta.', [
        { text: 'OK' },
      ]);
    }
  };

  const updateGroup = async () => {
    const folderName = newFolderName.trim();
    setIsRenameGroupModalVisible(false);

    if (folderName === '') {
      Alert.alert('', 'Por favor, introduce un nombre para la nueva carpeta.', [
        { text: 'OK' },
      ]);
      return;
    }

    const { error } = await useEditTemplateWorkoutGroup(
      groupedRoutine.groupId,
      folderName
    );

    if (!error) {
      setNewFolderName(folderName);
      emitter.emit('groupRenamed');
    } else {
      setNewFolderName(groupedRoutine.groupName!);
      Alert.alert('', 'Se ha producido un error al renombrar la carpeta.', [
        { text: 'OK' },
      ]);
    }
  };

  const componentsRenameGroupPopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white mb-4">
      Nuevo nombre de la carpeta
    </Text>,
    <Input key="2" className="mb-4">
      <InputField
        placeholder="Nuevo nombre"
        value={newFolderName}
        onChangeText={setNewFolderName}
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
      className="bg-zinc-700 rounded-lg"
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
      <Pencil color="white" />
      <Text className="text-white">Renombrar Carpeta</Text>
    </Button>,
    <Button
      key="2"
      className="bg-transparent gap-2"
      onPress={() => createRoutine()}
    >
      <Plus color="white" />
      <Text className="text-white">Agregar nueva rutina</Text>
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
    <Text key="1" className="text-xl font-bold text-center text-white pb-8">
      ¿Está seguro de que quiere eliminar la carpeta?
    </Text>,
    <Button
      testID="delete-button"
      key="2"
      className="bg-red-800 rounded-lg mb-4"
      onPress={() => {
        setIsDeleteModalVisible(false);
        deleteGroup();
      }}
    >
      <Text className="text-white">Eliminar carpeta</Text>
    </Button>,
    <Button
      key="3"
      className="bg-zinc-700 rounded-lg"
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

        {groupedRoutine.groupName && (
          <Button
            testID="slideup-modal"
            className="bg-transparent"
            onPress={() => {
              setIsSlideUpModalVisible(true);
            }}
          >
            <MoreHorizontal color="white" />
          </Button>
        )}
      </HStack>

      {showRoutines &&
        groupedRoutine.routines!.map((routine, index) => (
          <MyRoutinesCardResumeComponent
            backgroundColor={backgroundColor}
            textColor={textColor}
            backgrounColorPopUp={backgrounColorPopUp}
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
        backgroundColor={backgrounColorPopUp}
        components={componentsDeleteGroupPopUpModal}
        isVisible={isDeleteModalVisible}
        setIsModalVisible={setIsDeleteModalVisible}
      />

      <PopupBaseModal
        backgroundColor={backgrounColorPopUp}
        components={componentsRenameGroupPopUpModal}
        isVisible={isRenameGroupModalVisible}
        setIsModalVisible={setIsRenameGroupModalVisible}
      />
    </VStack>
  );
};

export default GroupedRoutinesResumeComponent;
