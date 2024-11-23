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
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Modal, Pressable, Vibration } from 'react-native';
import { InfoIcon, Play, Plus, Timer } from 'lucide-react-native';
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
  convertSecondsToString,
} from '@/utils/interval';
import {
  MAX_KG,
  MIN_KG,
  MAX_REPS,
  MIN_REPS,
  MAX_LENGHT_NOTES,
} from '../exercise/ExerciseResume';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Alert, AlertIcon, AlertText } from '../ui/alert';

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
    const [timerKey, setTimerKey] = useState(0);
    const [weightPrediction, setWeightPrediction] = useState<number | null>(
      null
    );

    useImperativeHandle(ref, () => ({
      getExerciseData: () => ({
        id: exerciseId,
        name: exerciseName,
        thumbnailUrl,
        restTime: exerciseRestTimeNumber > 0 ? exerciseRestTimeString : '0',
        notes: exerciseNotes,
        primaryMuscleGroup: exercisePrimaryMuscleGroup,
        sets: exerciseSets,
        targetReps,
      }),
      resetToOneSet() {
        setExerciseSets([{ reps: 0, weight: 0 }]);
      },
    }));

    const handleSetChange = (
      index: number,
      field: keyof SetsExerciseResume,
      value: string
    ) => {
      let numericValue = parseInt(value);

      if (field === 'weight') {
        numericValue = Math.max(MIN_KG, Math.min(MAX_KG, numericValue || 0));
      } else if (field === 'reps') {
        numericValue = Math.max(
          MIN_REPS,
          Math.min(MAX_REPS, numericValue || 0)
        );
      }

      const updatedSets = [...exerciseSets];
      updatedSets[index][field] = Number(numericValue);
      setExerciseSets(updatedSets);
    };

    const addNewSet = () => {
      const newSet: SetsExerciseResume = { weight: 0, reps: 0 };
      setExerciseSets([...exerciseSets, newSet]);
    };

    const startRestTimer = () => {
      setTimerKey((prev) => prev + 1);
      setRestTimerModalVisible(true);
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

    useEffect(() => {
      const maxVolumeSet = exerciseSets.reduce(
        (prev, current) => {
          const prevVolume = prev.weight * prev.reps;
          const currentVolume = current.weight * current.reps;
          return prevVolume > currentVolume ? prev : current;
        },
        { weight: 0, reps: 0 }
      );

      const oneRepMax = maxVolumeSet.weight * (1 + maxVolumeSet.reps / 30);

      if (targetReps !== undefined) {
        const targetWeight = oneRepMax * (1 - targetReps / 30);
        setWeightPrediction(Math.round(targetWeight));
      }
    }, [exerciseSets, targetReps]);

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
              onChangeText={(value) =>
                setExerciseNotes(value.slice(0, MAX_LENGHT_NOTES))
              }
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

          {targetReps !== undefined && weightPrediction !== null && (
            <Alert action="info" variant="solid">
              <AlertIcon as={InfoIcon} />
              <AlertText>
                Se recomienda emplear {weightPrediction} kg para llegar al
                número de {targetReps} repeticiones objetivo.
              </AlertText>
            </Alert>
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
                          onChangeText={(value) =>
                            handleSetChange(index, 'weight', value)
                          }
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
                          onChangeText={(value) =>
                            handleSetChange(index, 'reps', value)
                          }
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
          testID="modal"
          visible={restTimerModalVisible}
          transparent={true}
        >
          <Box className="flex-1 bg-black/75 justify-center items-center">
            <Box className="bg-zinc-800 rounded-lg items-center p-4 mx-8 self-center">
              <CountdownCircleTimer
                key={timerKey}
                isPlaying
                duration={exerciseRestTimeNumber}
                colors={['#1E40AF', '#3b82f6', '#A30000', '#A30000']}
                colorsTime={[30, 20, 10, 0]}
                onComplete={() => {
                  stopRestTimer();
                  return { shouldRepeat: false };
                }}
              >
                {({ remainingTime }) => (
                  <Text className="text-white text-xl">
                    {convertSecondsToString(remainingTime)}
                  </Text>
                )}
              </CountdownCircleTimer>
            </Box>
          </Box>
        </Modal>
      </>
    );
  }
);

export default DetailsExerciseWorkoutResumeComponent;
