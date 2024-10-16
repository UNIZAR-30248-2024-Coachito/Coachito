// BaseRepository.test.ts
import { createClient } from '../../__mocks__/@supabase/supabase-js';
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

  it('should create', async () => {
    const mockData: MockInsert = { name: 'Test Record' };

    await repository.create(mockData);

    expect(mockSupabase.from).toHaveBeenCalledWith('mockTable');
    expect(mockSupabase.from('mockTable').insert).toHaveBeenCalledWith(
      mockData
    );
  });

  it('should throw error when creating', async () => {
    const insertMock = mockSupabase.from('mockTable').insert;
    insertMock.mockImplementation(() => ({
      single: jest.fn().mockResolvedValue({
        data: null,
        error: new Error('Error'),
      }),
    }));

    await expect(repository.create({ name: 'Test Record' })).rejects.toThrow(
      'Error'
    );
  });

  it('should get all', async () => {
    await repository.getAll();

    expect(mockSupabase.from).toHaveBeenCalledWith('mockTable');
    expect(mockSupabase.from('mockTable').select).toHaveBeenCalledWith('*');
  });

  it('should throw error when fetching all', async () => {
    const selectMock = mockSupabase.from('mockTable').select;

    selectMock.mockResolvedValue({
      data: null,
      error: new Error('Error'),
    });

    await expect(repository.getAll()).rejects.toThrow('Error');
  });

  it('should get a record by id', async () => {
    const fromMock = mockSupabase.from('mockTable');
    const selectMock = fromMock.select;

    const singleMock = jest
      .fn()
      .mockResolvedValue({ data: { id: 1, name: 'Test Record' }, error: null });

    const eqMock = jest.fn().mockImplementation(() => ({
      single: singleMock,
    }));

    selectMock.mockImplementation(() => ({
      eq: eqMock,
    }));

    await repository.getById(1);

    expect(mockSupabase.from).toHaveBeenCalledWith('mockTable');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(eqMock).toHaveBeenCalledWith('id', 1);
    expect(singleMock).toHaveBeenCalled();
  });

  it('should throw error when fetching record by ID', async () => {
    const selectMock = mockSupabase.from('mockTable').select;
    selectMock.mockImplementation(() => ({
      eq: jest.fn().mockImplementation(() => ({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Error'),
        }),
      })),
    }));

    await expect(repository.getById(1)).rejects.toThrow('Error');
  });

  it('should update a record', async () => {
    const mockData = { id: 1, name: 'Updated Record' };
    const fromMock = mockSupabase.from('mockTable');
    const updateMock = fromMock.update;

    const singleMock = jest
      .fn()
      .mockResolvedValue({ data: mockData, error: null });

    const eqMock = jest.fn().mockImplementation(() => ({
      single: singleMock,
    }));

    updateMock.mockImplementation(() => ({
      eq: eqMock,
    }));

    await repository.update(mockData.id, mockData);

    expect(mockSupabase.from).toHaveBeenCalledWith('mockTable');
    expect(updateMock).toHaveBeenCalledWith(mockData);
    expect(eqMock).toHaveBeenCalledWith('id', 1);
    expect(singleMock).toHaveBeenCalledWith();
  });

  it('should throw error when updating a record', async () => {
    const mockData = { id: 1, name: 'Updated Record' };

    const updateMock = mockSupabase.from('mockTable').update;
    updateMock.mockImplementation(() => ({
      eq: jest.fn().mockImplementation(() => ({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Error'),
        }),
      })),
    }));

    await expect(repository.update(mockData.id, mockData)).rejects.toThrow(
      'Error'
    );
  });

  it('should delete a record by id', async () => {
    const fromMock = mockSupabase.from('mockTable');
    const deleteMock = fromMock.delete;

    const singleMock = jest
      .fn()
      .mockResolvedValue({ data: { id: 1, name: 'Test Record' }, error: null });

    const eqMock = jest.fn().mockImplementation(() => ({
      single: singleMock,
    }));

    deleteMock.mockImplementation(() => ({
      eq: eqMock,
    }));

    await repository.delete(1);

    expect(mockSupabase.from).toHaveBeenCalledWith('mockTable');
    expect(deleteMock).toHaveBeenCalledWith();
    expect(eqMock).toHaveBeenCalledWith('id', 1);
    expect(singleMock).toHaveBeenCalled();
  });

  it('should throw error when deleting a record by ID', async () => {
    const deleteMock = mockSupabase.from('mockTable').delete;
    deleteMock.mockImplementation(() => ({
      eq: jest.fn().mockImplementation(() => ({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Error'),
        }),
      })),
    }));

    await expect(repository.delete(1)).rejects.toThrow('Error');
  });
});
