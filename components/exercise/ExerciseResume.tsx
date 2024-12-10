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

export const MAX_LENGHT_NOTES = 4000;
export const MAX_REPS = 99;
export const MIN_REPS = 0;
export const MAX_KG = 499;
export const MIN_KG = 0;

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
    const [tempRestTime, setTempRestTime] = useState(exerciseRestTimeSeconds);
    const [exerciseNotes, setExerciseNotes] = useState(notes);
    const [exercisePrimaryMuscleGroup] = useState(primaryMuscleGroup);
    const [exerciseSets, setExerciseSets] = useState<SetsExerciseResume[]>(
      sets ?? []
    );
    const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
    const [targetNumberReps, setTargetNumberReps] = useState(
      targetReps !== undefined ? targetReps : MIN_REPS
    );

    useImperativeHandle(ref, () => ({
      getExerciseData: () => ({
        id: exerciseId,
        name: exerciseName,
        thumbnailUrl,
        restTime: exerciseRestTimeSeconds > 0 ? exerciseRestTimeString : '0',
        notes: exerciseNotes,
        primaryMuscleGroup: exercisePrimaryMuscleGroup,
        sets: exerciseSets,
        targetReps: targetNumberReps,
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
    }, [sets, restTime, notes]);

    const handleTargetRepsChange = (value: number) => {
      value = Math.max(MIN_REPS, Math.min(MAX_REPS, value || 0));
      setTargetNumberReps(value);
    };

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
      const newSet: SetsExerciseResume = { weight: MIN_KG, reps: MIN_REPS };
      setExerciseSets([...exerciseSets, newSet]);
    };

    const deleteSet = (index: number) => {
      const updatedSets = exerciseSets.filter((_, i) => i !== index);
      setExerciseSets(updatedSets);
    };

    const componentsTemporizadorPopUpModal: React.ReactNode[] = [
      <VStack key="1" className="gap-4 p-4">
        <Text className="text-center">
          {tempRestTime === 0
            ? '0 min 0 s'
            : `${convertSecondsToString(tempRestTime)}`}
        </Text>
        <Slider
          testID="slider"
          minimumValue={0}
          maximumValue={300}
          step={15}
          value={tempRestTime}
          onValueChange={(value) => setTempRestTime(value)}
          slideOnTap={true}
          thumbSize={20}
          trackHeight={6}
          thumbTintColor="#3b82f6"
          maximumTrackTintColor="grey"
          minimumTrackTintColor="#3b82f6"
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
          setExerciseRestTimeSeconds(tempRestTime);
          setExerciseRestTimeString(convertSecondsToString(tempRestTime));
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
              <Text className="text-xl text-typography-0" bold>
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

          <Text>Repeticiones objetivo:</Text>
          <Input className="text-center" variant="underlined">
            <InputField
              testID="targetNumberReps"
              placeholder={targetNumberReps.toString()}
              value={targetNumberReps.toString()}
              onChangeText={(value) => handleTargetRepsChange(parseInt(value))}
              keyboardType="numeric"
            />
          </Input>

          <Table className="w-[350px]">
            <TableHeader>
              <TableRow className="border-b-0 bg-background-0 hover:bg-background-0">
                <TableHead className="text-sm">SERIE</TableHead>
                <TableHead className="text-sm">KG</TableHead>
                <TableHead className="text-sm">REPS</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exerciseSets.map((set, index) => (
                <TableRow
                  testID="table-row"
                  key={index}
                  className="border-b-0 bg-background-100"
                >
                  <TableData>{index + 1}</TableData>
                  <TableData>
                    <Input className="w-full text-center" variant="underlined">
                      <InputField
                        testID="weight"
                        placeholder={MIN_KG.toString()}
                        value={set.weight ? set.weight.toString() : ''}
                        onChangeText={(value) =>
                          handleSetChange(index, 'weight', value)
                        }
                        keyboardType="numeric"
                      />
                    </Input>
                  </TableData>
                  <TableData>
                    <Input className="w-full text-center" variant="underlined">
                      <InputField
                        testID="reps"
                        placeholder={MIN_REPS.toString()}
                        value={set.reps ? set.reps.toString() : ''}
                        onChangeText={(value) =>
                          handleSetChange(index, 'reps', value)
                        }
                        keyboardType="numeric"
                      />
                    </Input>
                  </TableData>
                  <TableData>
                    {index !== 0 && (
                      <Button
                        testID="trash"
                        className="bg-transparent"
                        onPress={() => deleteSet(index)}
                      >
                        <Trash color="red" />
                      </Button>
                    )}
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {exerciseSets.length < 10 && (
            <Button
              className="bg-tertiary-500 rounded-lg gap-2"
              onPress={addNewSet}
            >
              <Plus color="white" />
              <Text className="text-white">Agregar Serie</Text>
            </Button>
          )}
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
