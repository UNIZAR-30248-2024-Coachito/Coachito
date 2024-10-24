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
import { Timer } from 'lucide-react-native';

export interface SetsExerciseResume {
  weight: number;
  reps: number;
}

export interface ExerciseResume {
  id: number;
  name: string;
  thumbnailUrl: string;
  restTime: string | null;
  notes: string;
  primaryMuscleGroup: string;
  sets: SetsExerciseResume[];
}

const ExerciseResumeComponent: React.FC<ExerciseResume> = ({
  name,
  thumbnailUrl,
  restTime,
  notes,
  sets,
}) => {
  return (
    <Pressable className="bg-zinc-900 p-4 mb-4 rounded-lg">
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

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>SERIE</TableHead>
            <TableHead>KG</TableHead>
            <TableHead>REPS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets.map((set, index) => (
            <TableRow
              key={index}
              className={
                index % 2 === 0
                  ? 'border-b-0 bg-background-50'
                  : 'border-b-0 bg-background-0'
              }
            >
              <TableData>{index + 1}</TableData>
              <TableData>{set.weight}</TableData>
              <TableData>{set.reps}</TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Pressable>
  );
};

export default ExerciseResumeComponent;
