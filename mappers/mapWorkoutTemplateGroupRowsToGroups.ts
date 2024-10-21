import { WorkoutTemplateGroupRow } from '@/repositories/workoutTemplateGroupRepository';
import { Group } from '@/screens/Routine';

export function mapWorkoutTemplateGroupRowsToGroups(
  rows: WorkoutTemplateGroupRow[]
): Group[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
  }));
}
