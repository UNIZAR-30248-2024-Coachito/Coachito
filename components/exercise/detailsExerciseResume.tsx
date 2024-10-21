import React from 'react';
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

export interface SeriesExerciseResume {
  serie: number;
  weight: number;
  reps: number;
}

export interface ExerciseSet {
  weight: number;
  reps: number;
}

export interface ExerciseResume {
  name: string;
  thumbnailUrl: string;
  restTime: string;
  notes: string;
  sets: ExerciseSet[];
}

const ExerciseResumeComponent: React.FC<ExerciseResume> = ({
  name,
  thumbnailUrl,
  restTime,
  notes,
  
}) => {
  return (
    <Pressable
      className="p-4"
      //onPress={() => navigation.navigate('DetailsRoutine', { templateId, myRoutineName })}
    >
      <HStack className="items-center gap-4">
        <Avatar>
          <AvatarFallbackText>{name}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: thumbnailUrl,
            }}
          />
        </Avatar>
        <Text className="flex-1 text-white" bold>
          {name}
        </Text>
      </HStack>

      <Text>{notes}</Text>

      <HStack className="gap-2 mb-4">
        <Timer color="#3b82f6" />
        <Text className="text-blue-500">
          Temporizador de descanso: {restTime}
        </Text>
      </HStack>

      <Table className="w-[350px] mb-4">
        <TableHeader>
          <TableRow className="border-b-0 bg-background-0 hover:bg-background-0">
            <TableHead>SERIE</TableHead>
            <TableHead>KG</TableHead>
            <TableHead>REPS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-b-0 bg-background-50">
            <TableData>1</TableData>
            <TableData>
              <Input className="w-[32px]" variant="underlined">
                <InputField />
              </Input>
            </TableData>
            <TableData>
              <Input className="w-[32px]" variant="underlined">
                <InputField />
              </Input>
            </TableData>
            <TableData>
              <Button
                className="bg-transparent"
                //onPress={() => {}}
              >
                <Trash color="red" />
              </Button>
            </TableData>
          </TableRow>
        </TableBody>
      </Table>

      <Button className="bg-gray-600 rounded-lg gap-2">
        <Plus color="gray" />
        <Text className="text-white">Agregar Serie</Text>
      </Button>

      {/*<VStack className="gap-4">
        <HStack className="w-full gap-8">
          <Text className="flex-1 p-2" bold>
            SERIE
          </Text>
          <Text className="flex-1 p-2" bold>
            KG
          </Text>
          <Text className="flex-1 p-2" bold>
            REPS
          </Text>
        </HStack>
        <HStack className="gap-2">
          <Text className="flex-1 p-2">1</Text>
          <Input className="flex-1 p-2" variant="underlined">
            <InputField placeholder="-" />
          </Input>
          <Input className="flex-1 p-2" variant="underlined">
            <InputField placeholder="-" />
          </Input>
        </HStack>
        <Button className="bg-gray-600 rounded-lg gap-2">
          <Plus color="gray" />
          <Text className="text-white">Agregar Serie</Text>
        </Button>
      </VStack>*/}
    </Pressable>
  );
};

export default ExerciseResumeComponent;
