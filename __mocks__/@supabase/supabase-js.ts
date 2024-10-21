/* eslint-disable @typescript-eslint/no-explicit-any */
// __mocks__/@supabase/supabase-js.ts
let testData: any[] = [];
let testError: Error | null = null;

export const createClient = jest.fn().mockImplementation(() => {
  return {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockImplementation(() => {
            if (testError) {
              return { data: null, error: testError };
            }
            return {
              data: testData.length > 0 ? testData[0] : null,
              error: null,
            };
          }),
        })),
        // Manejo de caso para obtener todos los registros
        // Devolviendo `data` y `error` de acuerdo al estado del test
        data: testData,
      })),
      insert: jest.fn().mockImplementation(() => ({
        single: jest.fn().mockImplementation(() => {
          if (testError) {
            return { data: null, error: testError };
          }
          return {
            data: testData.length > 0 ? testData[0] : null,
            error: null,
          };
        }),
      })),
      update: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockImplementation(() => {
            if (testError) {
              return { data: null, error: testError };
            }
            return {
              data: testData.length > 0 ? testData[0] : null,
              error: null,
            };
          }),
        })),
      })),
      delete: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation(() => ({
          single: jest.fn().mockImplementation(() => {
            if (testError) {
              return { data: null, error: testError };
            }
            return {
              data: testData.length > 0 ? testData[0] : null,
              error: null,
            };
          }),
        })),
      })),
    }),
  };
});

export const setTestData = (newData: any[]) => {
  testData = newData;
};

export const setTestError = (error: Error | null) => {
  testError = error;
};
