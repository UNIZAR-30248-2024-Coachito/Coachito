import React, { useState } from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { Button } from '../ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react-native';
import { Alert, Pressable } from 'react-native';
import { useDeleteWorkoutTemplate } from '@/hooks/workoutTemplateHook';
import SlideUpBaseModal from '../shared/SlideUpBaseModal';
import PopupBaseModal from '../shared/PopupBaseModal';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import { emitter } from '@/utils/emitter';

export interface MyRoutinesCardResume {
  templateId: number;
  myRoutineName: string;
  myRoutineExercises: string;
}

export interface MyRoutineCardResumeProps {
  backgroundColor: string;
  textColor: string;
  backgrounColorPopUp: string;
  routineCardResume: MyRoutinesCardResume;
  redColor: string;
  blueColor: string;
  exerciseColor: string;
  buttonColor: string;
}

const MyRoutinesCardResumeComponent: React.FC<MyRoutineCardResumeProps> = ({
  backgroundColor,
  textColor,
  backgrounColorPopUp,
  routineCardResume,
  redColor,
  blueColor,
  exerciseColor,
  buttonColor,
}) => {
  const navigation = useNavigation<NavigationProps>();
  const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const deleteRoutine = async () => {
    const { error } = await useDeleteWorkoutTemplate(
      routineCardResume.templateId
    );

    if (!error) {
      emitter.emit('routineDeleted');
    } else {
      Alert.alert('', 'Se ha producido un error al eliminar la rutina.', [
        { text: 'OK' },
      ]);
    }
  };

  const buttonsSlideUpModal: React.ReactNode[] = [
    <Button
      key="1"
      className="bg-transparent gap-2"
      onPress={() => {
        navigation.navigate('EditRoutine', {
          routineId: routineCardResume.templateId,
          routineName: routineCardResume.myRoutineName,
        });
      }}
    >
      <Pencil color="white" />
      <Text className="text-white">Editar Rutina</Text>
    </Button>,
    <Button
      key="2"
      className="bg-transparent gap-2"
      onPress={() => {
        setIsDeleteModalVisible(true);
        setIsSlideUpModalVisible(false);
      }}
    >
      <Trash color={redColor} />
      <Text style={{ color: redColor }}>Eliminar Rutina</Text>
    </Button>,
  ];

  const componentsPopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white pb-8">
      ¿Está seguro de que quiere eliminar la rutina?
    </Text>,
    <Button
      testID="delete-button"
      key="2"
      className="bg-red-800 rounded-lg mb-4"
      onPress={() => {
        setIsDeleteModalVisible(false);
        deleteRoutine();
      }}
    >
      <Text className="text-white">Eliminar rutina</Text>
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
    <Pressable
      style={{ backgroundColor }}
      className="p-4 mb-4 rounded-lg"
      onPress={() =>
        navigation.navigate('DetailsRoutine', {
          templateId: routineCardResume.templateId,
          myRoutineName: routineCardResume.myRoutineName,
          textColor: textColor,
          backgrounColor: backgroundColor,
          blueColor: blueColor,
          exerciseColor: exerciseColor,
          buttonColor: buttonColor,
          redColor: redColor,
          backgroundColorPopUp: backgrounColorPopUp,
        })
      }
    >
      <Box className="flex-row justify-between items-center">
        <Text style={{ color: textColor }} className="text-xl font-bold mb-2">
          {routineCardResume.myRoutineName}
        </Text>

        <Button
          testID="slideup-modal"
          className="bg-transparent"
          onPress={() => {
            setIsSlideUpModalVisible(true);
          }}
        >
          <MoreHorizontal color={textColor} />
        </Button>
      </Box>

      <Text className="text-gray-400 mb-4">
        {routineCardResume.myRoutineExercises}
      </Text>

      <Button
        style={{ backgroundColor: blueColor }}
        className="rounded-lg"
        onPress={() =>
          navigation.navigate('StartWorkout', {
            routineId: routineCardResume.templateId,
            routineName: routineCardResume.myRoutineName,
            textColor,
            backgroundColor,
            backgrounColorPopUp,
            redColor,
            blueColor,
          })
        }
      >
        <Text className="text-white">Empezar Entrenamiento</Text>
      </Button>

      <SlideUpBaseModal
        buttons={buttonsSlideUpModal}
        title={routineCardResume.myRoutineName}
        isVisible={isSlideUpModalVisible}
        setIsModalVisible={setIsSlideUpModalVisible}
      />

      <PopupBaseModal
        backgroundColor={backgrounColorPopUp}
        components={componentsPopUpModal}
        isVisible={isDeleteModalVisible}
        setIsModalVisible={setIsDeleteModalVisible}
      />
    </Pressable>
  );
};

export default MyRoutinesCardResumeComponent;
