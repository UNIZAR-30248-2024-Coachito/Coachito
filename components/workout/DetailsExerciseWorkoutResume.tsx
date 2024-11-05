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
import { Pressable } from 'react-native';
import { Check, Plus, Timer } from 'lucide-react-native';
import { Input, InputField } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea, TextareaInput } from '../ui/textarea';
import { Box } from '../ui/box';
import {
  ExerciseResume,
  SetsExerciseResume,
} from '../routine/ExercisesRoutineResume';
import { convertIntervalToSeconds } from '@/utils/interval';
import PopupBaseModal from '../shared/PopupBaseModal';
import CountdownTimer from './CountDownTimer';

export interface ExerciseResumeRef {
  getExerciseData: () => ExerciseResume;
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
    const [exerciseRestTimeString] = useState(restTime ?? '0');
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
    }));

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

          <Table className="w-[340px]">
            <TableHeader>
              <TableRow className="border-b-0 bg-background-0 hover:bg-background-0">
                <TableHead>SERIE</TableHead>
                <TableHead>KG</TableHead>
                <TableHead>REPS</TableHead>
                <TableHead>
                  <Check color="gray" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exerciseSets &&
                exerciseSets.map((set, index) => (
                  <TableRow key={index} className="border-b-0 bg-background-50">
                    <TableData>{index + 1}</TableData>
                    <TableData>
                      <Input
                        className="w-full text-center"
                        variant="underlined"
                      >
                        <InputField
                          placeholder={set.weight ? set.weight.toString() : '0'}
                          onChangeText={(value) =>
                            handleSetChange(index, 'weight', value)
                          }
                        />
                      </Input>
                    </TableData>
                    <TableData>
                      <Input
                        className="w-full text-center"
                        variant="underlined"
                      >
                        <InputField
                          placeholder={set.reps ? set.reps.toString() : '0'}
                          onChangeText={(value) =>
                            handleSetChange(index, 'reps', value)
                          }
                        />
                      </Input>
                    </TableData>
                    <TableData>
                      <Button className="bg-gray-400" onPress={startRestTimer}>
                        <Check color="white" />
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

        <PopupBaseModal
          components={componentsTimerPopUpModal}
          isVisible={restTimerModalVisible}
          setIsModalVisible={setRestTimerModalVisible}
        />
      </>
    );
  }
);

export default DetailsExerciseWorkoutResumeComponent;
