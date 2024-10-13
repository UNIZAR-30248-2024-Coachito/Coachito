// BaseRepository.test.ts
import {
  createClient,
  setTestData,
  setTestError,
} from '../../__mocks__/@supabase/supabase-js';
import { BaseRepository } from '../../repositories/baseRepository';

interface MockRow {
  id: number;
  name: string;
}

interface MockInsert {
  name: string;
}

interface MockUpdate {
  name?: string;
}

describe('BaseRepository', () => {
  let mockSupabase: ReturnType<typeof createClient>;
  let repository: BaseRepository<MockRow, MockInsert, MockUpdate>;

  beforeEach(() => {
    mockSupabase = createClient();
    repository = new BaseRepository<MockRow, MockInsert, MockUpdate>(
      mockSupabase,
      'mockTable'
    );
  });

  it('should create a new record', async () => {
    const mockData: MockInsert = { name: 'Test Record' };
    const expectedResponse: MockRow = { id: 1, name: 'Test Record' };

    setTestData([expectedResponse]); // Establecer el dato de prueba

    const result = await repository.create(mockData);

    expect(mockSupabase.from).toHaveBeenCalledWith('mockTable');
    expect(mockSupabase.from('mockTable').insert).toHaveBeenCalledWith(
      mockData
    );
    expect(result).toEqual(expectedResponse);
  });

  it('should get all records', async () => {
    const mockResponse: MockRow[] = [
      { id: 1, name: 'Test Record' },
      { id: 2, name: 'Another Record' },
    ];

    setTestData(mockResponse); // Establecer datos de prueba
    const data = await repository.getAll();

    expect(mockSupabase.from).toHaveBeenCalledWith('mockTable');
    expect(mockSupabase.from('mockTable').select).toHaveBeenCalledWith('*');
    expect(data).toEqual(mockResponse);
  });

  it('should get a record by id', async () => {
    const mockResponse: MockRow = { id: 1, name: 'Test Record' };

    setTestData([mockResponse]); // Establecer datos de prueba

    const result = await repository.getById(1);

    expect(mockSupabase.from).toHaveBeenCalledWith('mockTable');
    expect(mockSupabase.from('mockTable').select).toHaveBeenCalledWith('*');
    expect(mockSupabase.from('mockTable').eq).toHaveBeenCalledWith('id', 1);
    expect(result).toEqual(mockResponse);
  });

  it('should update a record', async () => {
    const mockResponse: MockRow = { id: 1, name: 'Updated Record' };
    const mockData: MockUpdate = { name: 'Updated Record' };

    setTestData([mockResponse]); // Establecer datos de prueba

    const result = await repository.update(1, mockData);

    expect(mockSupabase.from).toHaveBeenCalledWith('mockTable');
    expect(mockSupabase.from('mockTable').update).toHaveBeenCalledWith(
      mockData
    );
    expect(mockSupabase.from('mockTable').eq).toHaveBeenCalledWith('id', 1);
    expect(result).toEqual(mockResponse);
  });

  it('should delete a record', async () => {
    const mockResponse: MockRow = { id: 1, name: 'Test Record' };

    setTestData([mockResponse]); // Establecer datos de prueba

    const result = await repository.delete(1);

    expect(mockSupabase.from).toHaveBeenCalledWith('mockTable');
    expect(mockSupabase.from('mockTable').delete).toHaveBeenCalled();
    expect(mockSupabase.from('mockTable').eq).toHaveBeenCalledWith('id', 1);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when creating a record fails', async () => {
    const mockData: MockInsert = { name: 'Test Record' };
    const error = new Error('Insert error');
    setTestError(error); // Establecer un error para el test

    await expect(repository.create(mockData)).rejects.toThrow('Insert error');
  });

  it('should throw an error when getting all records fails', async () => {
    const error = new Error('Select error');
    setTestError(error); // Establecer un error para el test

    await expect(repository.getAll()).rejects.toThrow('Select error');
  });
});
