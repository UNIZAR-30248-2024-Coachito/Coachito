import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
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
import { Modal, Pressable, Vibration } from 'react-native';
import { Play, Plus, Timer } from 'lucide-react-native';
import { Input, InputField } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea, TextareaInput } from '../ui/textarea';
import { Box } from '../ui/box';
import {
  ExerciseResume,
  SetsExerciseResume,
} from '../routine/ExercisesRoutineResume';
import {
  convertIntervalToMinutesAndSeconds,
  convertIntervalToSeconds,
} from '@/utils/interval';
import CountdownTimer from './CountDownTimer';
import { MAX_KG, MIN_KG, MAX_REPS, MIN_REPS } from '../exercise/ExerciseResume';

export interface ExerciseResumeRef {
  getExerciseData: () => ExerciseResume;
  resetToOneSet: () => void;
}

// eslint-disable-next-line react/display-name
const DetailsExerciseWorkoutResumeComponent = forwardRef<
  ExerciseResumeRef,
  ExerciseResume
>(
  (
    { id, name, thumbnailUrl, restTime, notes, primaryMuscleGroup, sets },
    ref
  ) => {
    const [exerciseId] = useState(id);
    const [exerciseName] = useState(name);
    const [exerciseRestTimeNumber] = useState(
      convertIntervalToSeconds(restTime)
    );
    const [exerciseRestTimeString] = useState(
      convertIntervalToMinutesAndSeconds(restTime)
    );
    const [exerciseNotes, setExerciseNotes] = useState(notes);
    const [exercisePrimaryMuscleGroup] = useState(primaryMuscleGroup);
    const [exerciseSets, setExerciseSets] = useState<SetsExerciseResume[]>(
      sets ?? []
    );
    const [restTimerModalVisible, setRestTimerModalVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      getExerciseData: () => ({
        id: exerciseId,
        name: exerciseName,
        thumbnailUrl,
        restTime: exerciseRestTimeNumber > 0 ? exerciseRestTimeString : '0',
        notes: exerciseNotes,
        primaryMuscleGroup: exercisePrimaryMuscleGroup,
        sets: exerciseSets,
      }),
      resetToOneSet() {
        setExerciseSets([{ reps: 0, weight: 0 }]);
      },
    }));

    const isInputValid = (field: string, value: number) => {
      if (field === 'weight' && (value > MAX_KG || value < MIN_KG)) {
        alert(`El peso debe estar entre ${MIN_KG} y ${MAX_KG} kg`);
        return false;
      }
      if (field === 'reps' && (value > MAX_REPS || value < MIN_REPS)) {
        alert(`Las repeticiones deben estar entre ${MIN_REPS} y ${MAX_REPS}`);
        return false;
      }
      return true;
    };

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

    const startRestTimer = () => {
      if (exerciseRestTimeNumber > 0) {
        setRestTimerModalVisible(true);
      }
    };

    const stopRestTimer = () => {
      setRestTimerModalVisible(false);
      Vibration.vibrate(2000);
    };

    useEffect(() => {
      if (!exerciseSets || exerciseSets.length === 0) {
        addNewSet();
      }
    }, [exerciseSets]);

    const componentsTimerPopUpModal: React.ReactNode[] = [
      <CountdownTimer
        key="1"
        initialTime={exerciseRestTimeNumber}
        onComplete={stopRestTimer}
      />,
    ];

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

          <HStack className="gap-2">
            <Timer color="#3b82f6" />
            <Text className="text-blue-500">
              Temporizador de descanso:{' '}
              {exerciseRestTimeNumber > 0
                ? exerciseRestTimeString
                : 'DESACTIVADO'}
            </Text>
          </HStack>

          {exerciseRestTimeNumber > 0 && !restTimerModalVisible && (
            <Button
              testID="start-timer"
              className="border-2 border-blue-500 bg-transparent rounded-lg gap-2"
              onPress={startRestTimer}
            >
              <Play color="white" />
              <Text className="text-white">Iniciar</Text>
            </Button>
          )}

          <Table className="w-[330px]">
            <TableHeader>
              <TableRow className="border-b-0 bg-background-0 hover:bg-background-0">
                <TableHead>SERIE</TableHead>
                <TableHead>KG</TableHead>
                <TableHead>REPS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exerciseSets &&
                exerciseSets.map((set, index) => (
                  <TableRow
                    testID="table-row"
                    key={index}
                    className="border-b-0 bg-background-50"
                  >
                    <TableData>{index + 1}</TableData>
                    <TableData>
                      <Input
                        className="w-full text-center"
                        variant="underlined"
                      >
                        <InputField
                          testID="weight"
                          placeholder={
                            set.weight
                              ? set.weight.toString()
                              : MIN_KG.toString()
                          }
                          value={set.weight ? set.weight.toString() : ''}
                          onChangeText={(value) => {
                            if (isInputValid('weight', parseInt(value))) {
                              handleSetChange(index, 'weight', value);
                            } else {
                              handleSetChange(index, 'weight', '');
                            }
                          }}
                          keyboardType="numeric"
                        />
                      </Input>
                    </TableData>
                    <TableData>
                      <Input
                        className="w-full text-center"
                        variant="underlined"
                      >
                        <InputField
                          testID="reps"
                          placeholder={
                            set.reps ? set.reps.toString() : MIN_REPS.toString()
                          }
                          value={set.reps ? set.reps.toString() : ''}
                          onChangeText={(value) => {
                            if (isInputValid('reps', parseInt(value))) {
                              handleSetChange(index, 'reps', value);
                            } else {
                              handleSetChange(index, 'reps', '');
                            }
                          }}
                          keyboardType="numeric"
                        />
                      </Input>
                    </TableData>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {exerciseSets.length < 10 && (
            <Button
              className="bg-zinc-800 rounded-lg gap-2"
              onPress={addNewSet}
            >
              <Plus color="gray" />
              <Text className="text-white">Agregar Serie</Text>
            </Button>
          )}
        </Box>

        <Modal
          visible={restTimerModalVisible}
          transparent={true}
          onRequestClose={() => {
            setRestTimerModalVisible(false);
          }}
        >
          <Box className="flex-1 bg-black/75 justify-center items-center">
            <Box className="bg-zinc-800 rounded-lg items-center p-4 mx-8 self-center">
              {componentsTimerPopUpModal.map((component) => component)}
            </Box>
          </Box>
        </Modal>
      </>
    );
  }
);

export default DetailsExerciseWorkoutResumeComponent;
