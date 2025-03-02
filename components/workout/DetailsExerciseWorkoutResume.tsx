import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useContext,
  useRef,
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
import { Modal, Vibration } from 'react-native';
import {
  InfoIcon,
  PauseCircle,
  Play,
  PlayCircle,
  Plus,
  Square,
  Timer,
} from 'lucide-react-native';
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
import { Audio } from 'expo-av';
import { ThemeContext } from '@/context/ThemeContext';
import { VStack } from '../ui/vstack';

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
    const { colorMode } = useContext(ThemeContext);
    const [exerciseRestTimeNumber] = useState(
      convertIntervalToSeconds(restTime)
    );
    const [exerciseRestTimeString] = useState(
      convertIntervalToMinutesAndSeconds(restTime)
    );
    const [exerciseNotes, setExerciseNotes] = useState(notes);
    const [exerciseSets, setExerciseSets] = useState<SetsExerciseResume[]>(
      sets ?? []
    );
    const [restTimerModalVisible, setRestTimerModalVisible] = useState(false);
    const [timerKey, setTimerKey] = useState(0);
    const [weightPrediction, setWeightPrediction] = useState<number | null>(
      null
    );
    const [isPlaying, setIsPlaying] = useState(true);
    const beepSound = useRef<Audio.Sound | null>(null);

    useImperativeHandle(ref, () => ({
      getExerciseData: () => ({
        id: id,
        name: name,
        thumbnailUrl,
        restTime: exerciseRestTimeNumber > 0 ? exerciseRestTimeString : '0',
        notes: exerciseNotes,
        primaryMuscleGroup: primaryMuscleGroup,
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
      setIsPlaying(true);
      setTimerKey((prev) => prev + 1);
      setRestTimerModalVisible(true);
    };

    const finishRestTimer = () => {
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
    }, [targetReps]);

    useEffect(() => {
      const loadSounds = async () => {
        const beep = new Audio.Sound();
        try {
          await beep.loadAsync(
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            require('../../assets/sounds/beep-rest-timer.mp3')
          );
          beepSound.current = beep;
        } catch (error) {
          console.error('Error al cargar sonidos:', error);
        }
      };

      loadSounds();

      return () => {
        beepSound.current?.unloadAsync();
      };
    }, []);

    return (
      <>
        <VStack className="p-4 rounded-lg gap-4">
          <HStack className="items-center gap-4 w-[270px]">
            <Avatar testID="icono-ejercicio">
              <AvatarFallbackText>{name}</AvatarFallbackText>
              <AvatarImage source={{ uri: thumbnailUrl }} />
            </Avatar>
            <Text className="text-xl text-typography-0" bold>
              {name}
            </Text>
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
              <Play color="#3b82f6" />
              <Text className="text-blue-500">Iniciar</Text>
            </Button>
          )}

          {targetReps !== null &&
            targetReps !== 0 &&
            targetReps !== undefined && (
              <Alert action="info" variant="solid">
                <AlertIcon as={InfoIcon} />
                <AlertText>
                  Se recomienda emplear {weightPrediction} kg para llegar al
                  número de {targetReps} repeticiones objetivo.
                </AlertText>
              </Alert>
            )}

          <Table className="w-[330px]" testID="tabla-workout">
            <TableHeader>
              <TableRow className="bg-background-200">
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
                    className={
                      index % 2 === 0
                        ? 'border-b-0 bg-background-0'
                        : 'border-b-0 bg-background-200'
                    }
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
              className="bg-secondary-500 rounded-lg gap-2"
              onPress={addNewSet}
            >
              <Plus color={`${colorMode === 'light' ? 'black' : 'gray'}`} />
              <Text className="text-typography-0">Agregar Serie</Text>
            </Button>
          )}
        </VStack>

        <Modal
          testID="modal"
          visible={restTimerModalVisible}
          transparent={true}
        >
          <Box className="flex-1 bg-black/75 justify-center items-center">
            <Box className="bg-secondary-500 rounded-lg items-center p-4 mx-8 self-center">
              <CountdownCircleTimer
                key={timerKey}
                isPlaying={isPlaying}
                duration={exerciseRestTimeNumber}
                colors={['#1E40AF', '#3b82f6', '#A30000', '#A30000']}
                colorsTime={[30, 20, 10, 0]}
                onUpdate={async (remainingTime) => {
                  if (remainingTime == 4) {
                    await beepSound.current?.replayAsync();
                  }
                }}
                onComplete={() => {
                  finishRestTimer();
                  return { shouldRepeat: false };
                }}
              >
                {({ remainingTime }) => (
                  <Text className="text-typography-0 text-xl">
                    {convertSecondsToString(remainingTime)}
                  </Text>
                )}
              </CountdownCircleTimer>
              <HStack className="gap-4 mt-4">
                <Button
                  className="bg-background-50 rounded-lg"
                  onPress={() => setRestTimerModalVisible(false)}
                >
                  <Square color="white" />
                </Button>
                <Button
                  testID="play/pause button"
                  className="bg-blue-500 rounded-lg"
                  onPress={() => setIsPlaying((prev) => !prev)}
                >
                  {isPlaying ? (
                    <PauseCircle color="white" testID="pause icon" />
                  ) : (
                    <PlayCircle color="white" testID="play icon" />
                  )}
                </Button>
              </HStack>
            </Box>
          </Box>
        </Modal>
      </>
    );
  }
);

export default DetailsExerciseWorkoutResumeComponent;
