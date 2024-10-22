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

export interface SeriesExerciseResume {
  serie: number;
  weight: number;
  reps: number;
}

export interface ExerciseResume {
  name: string;
  thumbnailUrl: string;
  restTime: string;
  notes: string;
  series: SeriesExerciseResume[];
  primary_muscle: string;
}

const ExerciseResumeComponent: React.FC<ExerciseResume> = ({
  name,
  thumbnailUrl,
  restTime,
  notes,
  series,
}) => {
  return (
    <Pressable
      className="bg-zinc-900 p-4 mb-4 rounded-lg"
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

      <HStack className="gap-2">
        <Timer color="#3b82f6" />
        <Text className="text-blue-500">
          Temporizador de descanso: {restTime}
        </Text>
      </HStack>

      <Table className="w-full mb-8">
        <TableHeader>
          <TableRow>
            <TableHead>SERIE</TableHead>
            <TableHead>KG</TableHead>
            <TableHead>REPS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {series.map((serie, index) => (
            <TableRow
              key={index}
              className={
                index % 2 === 0
                  ? 'border-b-0 bg-background-50'
                  : 'border-b-0 bg-background-0'
              }
            >
              <TableData>{serie.serie}</TableData>
              <TableData>{serie.weight}</TableData>
              <TableData>{serie.reps}</TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Pressable>
  );
};

export default ExerciseResumeComponent;
