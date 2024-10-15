import React, { useState } from 'react';
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
import GroupedRoutinesResumeComponent from '@/components/myRoutines/GroupedRoutinesResume';
import PopupBaseModal from '@/components/shared/PopupBaseModal';
import { Input, InputField } from '@/components/ui/input';
import { useCreateTemplateWorkoutGroup } from '@/hooks/workoutTemplateGroupHook';

const Routine: React.FC = () => {
  const { myRoutineResume, loading, error } = useFetchTemplateWorkouts();
  const navigation = useNavigation<NavigationProps>();
  const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderInputValue, setNewFolderInputValue] = useState('');

  const handleInsert = async () => {
    if (newFolderName.trim() === '') {
      alert('Por favor, introduce un nombre para la nueva carpeta.');
      return;
    }
    //await useCreateTemplateWorkoutGroup({ name: newFolderName });
    console.log("Carpeta añadida");
  };

  const componentsPopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white mb-4">
      Crear nueva carpeta
    </Text>,
    <Input key="2" className="mb-4">
      <InputField
        placeholder="Nueva carpeta"
        value={newFolderInputValue}
        onChangeText={setNewFolderName}
      />
    </Input>,
    <Button
      key="3"
      className="bg-blue-500 rounded-lg mb-4"
      onPress={() => {
        setNewFolderInputValue('');
        setIsNewGroupModalVisible(false);
        handleInsert();
      }}
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
            onPress={() => navigation.navigate('AddRoutine')}
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

        {!loading &&
          !error &&
          myRoutineResume!.map((routine, index) => (
            <GroupedRoutinesResumeComponent
              key={index}
              groupId={routine.groupId}
              groupName={routine.groupName}
              routines={routine.routines}
            />
          ))}

        <PopupBaseModal
          components={componentsPopUpModal}
          isVisible={isNewGroupModalVisible}
          setIsModalVisible={setIsNewGroupModalVisible}
        />
      </VStack>
    </ScrollView>
  );
};

export default Routine;
