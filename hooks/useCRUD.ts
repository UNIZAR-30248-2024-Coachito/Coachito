import { useEffect, useState } from 'react';
import { PostgrestResponseFailure } from '@supabase/postgrest-js/src/types';

interface UseCRUDReturn<DataType> {
  data: DataType | null;
  loading: boolean;
  error: string | null;
}

const useCRUD = <DataType>(
  asyncFunc: () => Promise<DataType>
): UseCRUDReturn<DataType> => {
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
      } catch (error: unknown) {
        if (isPostgrestResponseFailure(error)) {
          setError(error.error.message || 'Unknown error occurred');
        } else if (error instanceof Error) {
          setError(error.message);
        } else if (typeof error === 'string') {
          setError(error);
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    executeAsync();
  }, []);

  return { data, loading, error };
};

function isPostgrestResponseFailure(
  error: unknown
): error is PostgrestResponseFailure {
  return typeof error === 'object' && error !== null && 'error' in error;
}

export default useCRUD;
