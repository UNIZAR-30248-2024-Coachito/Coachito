export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      equipment_categories: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: never;
          name: string;
        };
        Update: {
          id?: never;
          name?: string;
        };
        Relationships: [];
      };
      exercise_types: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: never;
          name: string;
        };
        Update: {
          id?: never;
          name?: string;
        };
        Relationships: [];
      };
      exercises: {
        Row: {
          equipment_category_id: number;
          exercise_image_url: string;
          exercise_thumbnail_url: string;
          exercise_type_id: number;
          id: number;
          name: string;
          primary_muscle_group_id: number;
        };
        Insert: {
          equipment_category_id: number;
          exercise_image_url: string;
          exercise_thumbnail_url: string;
          exercise_type_id: number;
          id?: never;
          name: string;
          primary_muscle_group_id: number;
        };
        Update: {
          equipment_category_id?: number;
          exercise_image_url?: string;
          exercise_thumbnail_url?: string;
          exercise_type_id?: number;
          id?: never;
          name?: string;
          primary_muscle_group_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'exercises_equipment_category_id_fkey';
            columns: ['equipment_category_id'];
            isOneToOne: false;
            referencedRelation: 'equipment_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercises_exercise_type_id_fkey';
            columns: ['exercise_type_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_types';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercises_muscle_group_id_fkey';
            columns: ['primary_muscle_group_id'];
            isOneToOne: false;
            referencedRelation: 'muscle_groups';
            referencedColumns: ['id'];
          },
        ];
      };
      exercises_muscle_groups: {
        Row: {
          exercise_id: number;
          id: number;
          muscle_group_id: number;
        };
        Insert: {
          exercise_id: number;
          id?: never;
          muscle_group_id: number;
        };
        Update: {
          exercise_id?: number;
          id?: never;
          muscle_group_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'exercises_muscle_groups_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercises_muscle_groups_muscle_group_id_fkey';
            columns: ['muscle_group_id'];
            isOneToOne: false;
            referencedRelation: 'muscle_groups';
            referencedColumns: ['id'];
          },
        ];
      };
      muscle_groups: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: never;
          name: string;
        };
        Update: {
          id?: never;
          name?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          id: number;
          password_hash: string;
          username: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: never;
          password_hash: string;
          username: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: never;
          password_hash?: string;
          username?: string;
        };
        Relationships: [];
      };
      workout_exercises: {
        Row: {
          created_at: string | null;
          distance: number | null;
          exercise_id: number | null;
          id: number;
          notes: string | null;
          reps: number | null;
          rest_time: unknown | null;
          sets: number | null;
          target_number_reps: number | null;
          weight: number | null;
          workout_id: number | null;
        };
        Insert: {
          created_at?: string | null;
          distance?: number | null;
          exercise_id?: number | null;
          id?: never;
          notes?: string | null;
          reps?: number | null;
          rest_time?: unknown | null;
          sets?: number | null;
          target_number_reps?: number | null;
          weight?: number | null;
          workout_id?: number | null;
        };
        Update: {
          created_at?: string | null;
          distance?: number | null;
          exercise_id?: number | null;
          id?: never;
          notes?: string | null;
          reps?: number | null;
          rest_time?: unknown | null;
          sets?: number | null;
          target_number_reps?: number | null;
          weight?: number | null;
          workout_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'workout_exercises_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workout_exercises_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'workouts';
            referencedColumns: ['id'];
          },
        ];
      };
      workout_templates: {
        Row: {
          created_at: string | null;
          deleted: boolean;
          group_id: number | null;
          id: number;
          name: string;
          user_id: number;
        };
        Insert: {
          created_at?: string | null;
          deleted?: boolean;
          group_id?: number | null;
          id?: never;
          name: string;
          user_id: number;
        };
        Update: {
          created_at?: string | null;
          deleted?: boolean;
          group_id?: number | null;
          id?: never;
          name?: string;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'workout_templates_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'workout_templates_group';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workout_templates_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      workout_templates_group: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: never;
          name: string;
        };
        Update: {
          id?: never;
          name?: string;
        };
        Relationships: [];
      };
      workouts: {
        Row: {
          created_at: string | null;
          duration: unknown | null;
          id: number;
          template: boolean;
          template_id: number;
          volume: number | null;
        };
        Insert: {
          created_at?: string | null;
          duration?: unknown | null;
          id?: never;
          template?: boolean;
          template_id: number;
          volume?: number | null;
        };
        Update: {
          created_at?: string | null;
          duration?: unknown | null;
          id?: never;
          template?: boolean;
          template_id?: number;
          volume?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_workouts_template_id';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'workout_templates';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workouts_template_id_fkey';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'workout_templates';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      equipment_category_enum:
        | 'Barbell'
        | 'Dumbbell'
        | 'Kettlebell'
        | 'Machine'
        | 'Plate'
        | 'Resistance Band'
        | 'Suspension'
        | 'Other';
      exercise_type_enum:
        | 'Weight Reps Reps Only'
        | 'Weighted Bodyweight'
        | 'Assisted Bodyweight'
        | 'Duration'
        | 'Weight & Duration'
        | 'Distance Duration'
        | 'Weight & Distance';
      muscle_group_enum:
        | 'Abdominals'
        | 'Abductors'
        | 'Adductors'
        | 'Biceps'
        | 'Lower Back'
        | 'Upper Back'
        | 'Cardio'
        | 'Chest'
        | 'Calves'
        | 'Forearms'
        | 'Glutes'
        | 'Hamstrings'
        | 'Lats'
        | 'Quadriceps'
        | 'Shoulders'
        | 'Triceps'
        | 'Traps'
        | 'Neck'
        | 'Full Body'
        | 'Other';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
