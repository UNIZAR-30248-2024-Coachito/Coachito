import { AxiosResponse } from 'axios';

interface UseCRUDReturn<DataType> {
  execute: () => Promise<{
    data: DataType | null;
    error: string | null;
  }>;
}

const useCRUD = <DataType>(
  asyncFunc: () => Promise<AxiosResponse<DataType>>
): UseCRUDReturn<DataType> => {
  const execute = async () => {
    let data: DataType | null = null;
    let error: string | null = null;

    try {
      const response = await asyncFunc();
      data = response.data;
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'An unknown error occurred';
      console.error('Error executing async function:', error);
    }

    return { data, error };
  };

  return { execute };
};

export default useCRUD;
