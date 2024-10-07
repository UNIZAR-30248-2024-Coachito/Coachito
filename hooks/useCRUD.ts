import { useEffect, useState } from 'react';

interface UseCRUDReturn<DataType> {
  data: DataType | null;
  loading: boolean;
  error: string | null;
}

const useCRUD = <DataType,>(asyncFunc: () => Promise<DataType>): UseCRUDReturn<DataType> => {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const executeAsync = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunc();
        setData(result);
      } catch (error: any) {
        if (error && typeof error.message === 'string') {
          setError(error.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    executeAsync();
  }, [asyncFunc]);

  return { data, loading, error };
};

export default useCRUD;
