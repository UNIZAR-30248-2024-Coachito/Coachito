// useCRUD.test.ts
import useCRUD from '@/hooks/useCRUD';
import { AxiosResponse, AxiosHeaders } from 'axios';

describe('useCRUD', () => {
  it('should return data when asyncFunc resolves successfully', async () => {
    // Arrange
    const mockData = { foo: 'bar' };
    const asyncFunc = jest
      .fn<Promise<AxiosResponse<typeof mockData>>, []>()
      .mockResolvedValue({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(), // Use AxiosHeaders instance
        config: { headers: new AxiosHeaders() }, // Use AxiosHeaders instance
      });

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { execute } = useCRUD(asyncFunc);

    // Act
    const result = await execute();

    // Assert
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should return error when asyncFunc rejects with an Error instance', async () => {
    // Arrange
    const errorMessage = 'Test error';
    const error = new Error(errorMessage);
    const asyncFunc = jest
      .fn<Promise<AxiosResponse<never>>, []>()
      .mockRejectedValue(error);

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { execute } = useCRUD(asyncFunc);

    // Act
    const result = await execute();

    // Assert
    expect(result.data).toBeNull();
    expect(result.error).toBe(errorMessage);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error executing async function:',
      errorMessage
    );

    consoleErrorSpy.mockRestore();
  });

  it('should return "An unknown error occurred" when asyncFunc rejects with a non-Error instance', async () => {
    // Arrange
    const unknownError = 'Some error';
    const asyncFunc = jest
      .fn<Promise<AxiosResponse<never>>, []>()
      .mockRejectedValue(unknownError);

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { execute } = useCRUD(asyncFunc);

    // Act
    const result = await execute();

    // Assert
    expect(result.data).toBeNull();
    expect(result.error).toBe('An unknown error occurred');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error executing async function:',
      'An unknown error occurred'
    );

    consoleErrorSpy.mockRestore();
  });
});
