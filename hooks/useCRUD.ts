import { PostgrestError } from '@supabase/postgrest-js/src/types';

interface UseCRUDReturn<DataType> {
  execute: () => Promise<{
    data: DataType | null;
    error: PostgrestError | null;
  }>;
}

const useCRUD = <DataType>(
  asyncFunc: () => Promise<DataType>
): UseCRUDReturn<DataType> => {
  const execute = async () => {
    let data = null;
    let error = null;

    try {
      data = await asyncFunc();
    } catch (e: unknown) {
      error = e as PostgrestError;
      console.error(error);
    }

    return { data, error };
  };

  return { execute };
};

export default useCRUD;
