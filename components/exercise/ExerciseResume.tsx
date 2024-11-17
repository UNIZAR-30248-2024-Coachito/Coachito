import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { Text } from '../ui/text';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableData,
} from '../ui/table';
import { HStack } from '../ui/hstack';
import '../../styles.css';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Pressable } from 'react-native';
import { Plus, Timer, Trash } from 'lucide-react-native';
import { Input, InputField } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea, TextareaInput } from '../ui/textarea';
import SlideUpBaseModal from '../shared/SlideUpBaseModal';
import { VStack } from '../ui/vstack';
import { Box } from '../ui/box';
import Slider from '@react-native-assets/slider';
import {
  ExerciseResume,
  SetsExerciseResume,
} from '../routine/ExercisesRoutineResume';
import {
  convertIntervalToSeconds,
  convertSecondsToString,
  convertStringToInterval,
} from '@/utils/interval';

export interface ExerciseResumeRef {
  getExerciseData: () => ExerciseResume;
}

// eslint-disable-next-line react/display-name
const ExerciseResumeComponent = forwardRef<ExerciseResumeRef, ExerciseResume>(
  (
    {
      id,
      name,
      thumbnailUrl,
      restTime,
      notes,
      primaryMuscleGroup,
      sets,
      targetReps,
    },
    ref
  ) => {
    const [exerciseId] = useState(id);
    const [exerciseName] = useState(name);
    const [exerciseRestTimeSeconds, setExerciseRestTimeSeconds] = useState(
      convertIntervalToSeconds(restTime)
    );
    const [exerciseRestTimeString, setExerciseRestTimeString] =
      useState(restTime);
    const [exerciseNotes, setExerciseNotes] = useState(notes);
    const [exercisePrimaryMuscleGroup] = useState(primaryMuscleGroup);
    const [exerciseSets, setExerciseSets] = useState<SetsExerciseResume[]>(
      sets ?? []
    );
    const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
    const [targetNumberReps, setTargetNumberReps] = useState<string>(
      targetReps !== undefined ? targetReps.toString() : ''
    );

    const handleTargetNumberRepsChange = (value: string) => {
      setTargetNumberReps(value); // Almacena directamente el valor del InputField
    };

    useImperativeHandle(ref, () => ({
      getExerciseData: () => ({
        id: exerciseId,
        name: exerciseName,
        thumbnailUrl,
        restTime: exerciseRestTimeSeconds > 0 ? exerciseRestTimeString : '0',
        notes: exerciseNotes,
        primaryMuscleGroup: exercisePrimaryMuscleGroup,
        sets: exerciseSets,
        targetReps: targetReps ? parseInt(targetNumberReps, 10) : undefined,
      }),
    }));

    useEffect(() => {
      setExerciseSets(sets ?? []);
      setExerciseRestTimeString(restTime);
      setExerciseNotes(notes);
      setExerciseRestTimeSeconds(
        convertIntervalToSeconds(
          convertStringToInterval(restTime ? restTime : '0')
        )
      );
      setTargetNumberReps(
        targetReps !== undefined ? targetNumberReps.toString() : ''
      );
    }, [sets, restTime, notes, targetReps]);

    const handleSetChange = (
      index: number,
      field: keyof SetsExerciseResume,
      value: string
    ) => {
      const updatedSets = [...exerciseSets];
      updatedSets[index][field] = Number(value);
      setExerciseSets(updatedSets);
    };

    const addNewSet = () => {
      const newSet: SetsExerciseResume = { weight: 0, reps: 0 };
      setExerciseSets([...exerciseSets, newSet]);
    };

    const deleteSet = (index: number) => {
      const updatedSets = exerciseSets.filter((_, i) => i !== index);
      setExerciseSets(updatedSets);
    };

    const componentsTemporizadorPopUpModal: React.ReactNode[] = [
      <VStack key="1" className="gap-4 p-4">
        <Text className="text-center">
          {exerciseRestTimeSeconds === 0
            ? '0 min 0 s'
            : `${convertSecondsToString(exerciseRestTimeSeconds)}`}
        </Text>
        <Slider
          testID="slider"
          minimumValue={0}
          maximumValue={300}
          step={15}
          value={exerciseRestTimeSeconds}
          onValueChange={(value) => setExerciseRestTimeSeconds(value)}
          slideOnTap={true}
          thumbSize={20}
          trackHeight={6}
          thumbTintColor="white"
          maximumTrackTintColor="grey"
          minimumTrackTintColor="grey"
          hitSlop={40}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            paddingTop: 30,
            paddingBottom: 30,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        />
      </VStack>,
      <Button
        key="2"
        className="bg-blue-500 rounded-lg"
        onPress={() => {
          setIsSlideUpModalVisible(false);
          setExerciseRestTimeString(
            convertSecondsToString(exerciseRestTimeSeconds)
          );
        }}
      >
        <Text className="text-white">Confirmar</Text>
      </Button>,
    ];

    useEffect(() => {
      if (!exerciseSets || exerciseSets.length === 0) {
        addNewSet();
      }
    }, [exerciseSets]);

    return (
      <>
        <Box className="p-4 rounded-lg gap-4">
          <HStack className="items-center gap-4">
            <Avatar>
              <AvatarFallbackText>{exerciseName}</AvatarFallbackText>
              <AvatarImage source={{ uri: thumbnailUrl }} />
            </Avatar>
            <Pressable className="flex-1">
              <Text className="text-xl text-white" bold>
                {exerciseName}
              </Text>
            </Pressable>
          </HStack>

          <Textarea className="w-100">
            <TextareaInput
              testID="text-area-input"
              placeholder="Notas..."
              value={exerciseNotes}
              onChangeText={(value) => setExerciseNotes(value)}
            />
          </Textarea>

          <Button
            testID="temporizador"
            className="gap-2 bg-transparent"
            onPress={() => setIsSlideUpModalVisible(true)}
          >
            <Timer color="#3b82f6" />
            <Text className="text-blue-500">
              Temporizador de descanso:{' '}
              {exerciseRestTimeSeconds > 0
                ? exerciseRestTimeString
                : 'DESACTIVADO'}
            </Text>
          </Button>

          <Text>Objetivo de repeticiones</Text>
          <Input className="text-center" variant="underlined">
            <InputField
              testID="targetNumberReps"
              value={targetReps?.toString() ?? ''}
              onChangeText={handleTargetNumberRepsChange}
            />
          </Input>

          <Table className="w-[350px]">
            <TableHeader>
              <TableRow className="border-b-0 bg-background-0 hover:bg-background-0">
                <TableHead>SERIE</TableHead>
                <TableHead>KG</TableHead>
                <TableHead>REPS</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exerciseSets.map((set, index) => (
                <TableRow
                  testID="table-row"
                  key={index}
                  className="border-b-0 bg-background-50"
                >
                  <TableData>{index + 1}</TableData>
                  <TableData>
                    <Input className="w-full text-center" variant="underlined">
                      <InputField
                        testID="weight"
                        value={set.weight ? set.weight.toString() : '0'}
                        onChangeText={(value) =>
                          handleSetChange(index, 'weight', value)
                        }
                      />
                    </Input>
                  </TableData>
                  <TableData>
                    <Input className="w-full text-center" variant="underlined">
                      <InputField
                        testID="reps"
                        value={set.reps ? set.reps.toString() : '0'}
                        onChangeText={(value) =>
                          handleSetChange(index, 'reps', value)
                        }
                      />
                    </Input>
                  </TableData>
                  <TableData>
                    <Button
                      testID="trash"
                      className="bg-transparent"
                      onPress={() => deleteSet(index)}
                    >
                      <Trash color="red" />
                    </Button>
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button className="bg-zinc-800 rounded-lg gap-2" onPress={addNewSet}>
            <Plus color="gray" />
            <Text className="text-white">Agregar Serie</Text>
          </Button>
        </Box>

        <SlideUpBaseModal
          buttons={componentsTemporizadorPopUpModal}
          title={`Temporizador de descanso - ${exerciseName}`}
          isVisible={isSlideUpModalVisible}
          setIsModalVisible={setIsSlideUpModalVisible}
        />
      </>
    );
  }
);

export default ExerciseResumeComponent;
