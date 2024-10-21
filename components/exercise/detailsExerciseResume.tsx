import React, { forwardRef, useImperativeHandle, useState } from 'react';
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

export interface ExerciseSet {
  weight: number;
  reps: number;
}

export interface ExerciseResume {
  id: number;
  name: string;
  thumbnailUrl: string;
  restTime: number;
  notes: string;
  sets: ExerciseSet[];
}

export interface ExerciseResumeRef {
  getExerciseData: () => ExerciseResume;
}

// eslint-disable-next-line react/display-name
const ExerciseResumeComponent = forwardRef<ExerciseResumeRef, ExerciseResume>(
  ({ id, name, thumbnailUrl, restTime, notes, sets }, ref) => {
    const [exerciseId] = useState(id);
    const [exerciseName] = useState(name);
    const [exerciseRestTime, setExerciseRestTime] = useState(restTime);
    const [exerciseNotes, setExerciseNotes] = useState(notes);
    const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>(sets);
    const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      getExerciseData: () => ({
        id: exerciseId,
        name: exerciseName,
        thumbnailUrl,
        restTime: exerciseRestTime,
        notes: exerciseNotes,
        sets: exerciseSets,
      }),
    }));

    const handleSetChange = (
      index: number,
      field: keyof ExerciseSet,
      value: string
    ) => {
      const updatedSets = [...exerciseSets];
      updatedSets[index][field] = Number(value);
      setExerciseSets(updatedSets);
    };

    const addNewSet = () => {
      const newSet: ExerciseSet = { weight: 0, reps: 0 };
      setExerciseSets([...exerciseSets, newSet]);
    };

    const componentsTemporizadorPopUpModal: React.ReactNode[] = [
      <VStack key="1" className="gap-4 p-4">
        <Text className="text-center">
          {Math.floor(exerciseRestTime / 60)} min {exerciseRestTime % 60} s
        </Text>
        <Slider
          minimumValue={0}
          maximumValue={300}
          step={15}
          value={exerciseRestTime}
          onValueChange={(value) => setExerciseRestTime(value)}
          slideOnTap={true}
          thumbSize={20}
          trackHeight={6}
          thumbTintColor="white"
          maximumTrackTintColor="grey"
          minimumTrackTintColor="grey"
          hitSlop={40}
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
        }}
      >
        <Text className="text-white">Confirmar</Text>
      </Button>,
    ];

    return (
      <>
        <Box className="p-4 gap-4">
          <HStack className="items-center gap-4">
            <Avatar>
              <AvatarFallbackText>{exerciseName}</AvatarFallbackText>
              <AvatarImage source={{ uri: thumbnailUrl }} />
            </Avatar>
            <Pressable className="flex-1">
              <Text className="text-blue-500">{exerciseName}</Text>
            </Pressable>
          </HStack>

          <Textarea className="w-100">
            <TextareaInput
              placeholder="Notas..."
              value={exerciseNotes}
              onChangeText={(value) => setExerciseNotes(value)}
            />
          </Textarea>

          <Button
            className="gap-2 bg-transparent"
            onPress={() => setIsSlideUpModalVisible(true)}
          >
            <Timer color="#3b82f6" />
            <Text className="text-blue-500">
              Temporizador de descanso: {Math.floor(exerciseRestTime / 60)} min{' '}
              {exerciseRestTime % 60} s
            </Text>
          </Button>

          <Table className="w-[350px]">
            <TableHeader>
              <TableRow className="border-b-0 bg-background-0 hover:bg-background-0">
                <TableHead>SERIE</TableHead>
                <TableHead>KG</TableHead>
                <TableHead>REPS</TableHead>
                <TableHead className="w-[15px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exerciseSets.map((set, index) => (
                <TableRow key={index} className="border-b-0 bg-background-50">
                  <TableData>{index + 1}</TableData>
                  <TableData>
                    <Input
                      className="w-[32px] text-center"
                      variant="underlined"
                    >
                      <InputField
                        value={set.weight.toString()}
                        onChangeText={(value) =>
                          handleSetChange(index, 'weight', value)
                        }
                      />
                    </Input>
                  </TableData>
                  <TableData>
                    <Input
                      className="w-[32px] text-center"
                      variant="underlined"
                    >
                      <InputField
                        value={set.reps.toString()}
                        onChangeText={(value) =>
                          handleSetChange(index, 'reps', value)
                        }
                      />
                    </Input>
                  </TableData>
                  <TableData>
                    <Button
                      className="bg-transparent w-[15px]"
                      //onPress={() => setIsSlideUpModalVisible(true)}
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
