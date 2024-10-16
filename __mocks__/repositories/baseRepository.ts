// __mocks__/baseRepository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from '../../repositories/baseRepository';

export class BaseRepositoryMock<
  RowType,
  InsertType,
  UpdateType,
> extends BaseRepository<RowType, InsertType, UpdateType> {
  // Variables para simular datos y errores
  private testData: RowType[] = [];
  private testError: Error | null = null;

  constructor(supabase: SupabaseClient, table: string) {
    super(supabase, table);
  }

  // Método para establecer los datos de prueba
  setTestData(data: RowType[]) {
    this.testData = data;
  }

  // Método para establecer errores de prueba
  setTestError(error: Error | null) {
    this.testError = error;
  }

  // Sobrescribir el método create
  async create(data: InsertType): Promise<RowType> {
    if (this.testError) {
      throw this.testError; // Lanzar error si hay un error configurado
    }

    const newData = { ...data, id: this.testData.length + 1 } as RowType; // Simular un nuevo registro con un ID único
    this.testData.push(newData);
    return newData; // Retornar el nuevo registro
  }

  // Sobrescribir el método getAll
  async getAll(): Promise<RowType[]> {
    if (this.testError) {
      throw this.testError; // Lanzar error si hay un error configurado
    }
    return this.testData; // Retornar los datos simulados
  }

  // Sobrescribir el método getById
  async getById(id: number): Promise<RowType> {
    if (this.testError) {
      throw this.testError; // Lanzar error si hay un error configurado
    }
    const data = this.testData.find((item) => (item as any).id === id); // Buscar el registro por ID
    if (!data) throw new Error('Record not found'); // Lanzar error si no se encuentra
    return data; // Retornar el registro encontrado
  }

  // Sobrescribir el método update
  async update(id: number, data: UpdateType): Promise<RowType> {
    if (this.testError) {
      throw this.testError; // Lanzar error si hay un error configurado
    }
    const index = this.testData.findIndex((item) => (item as any).id === id); // Buscar el índice del registro
    if (index === -1) throw new Error('Record not found'); // Lanzar error si no se encuentra
    this.testData[index] = { ...this.testData[index], ...data } as RowType; // Actualizar el registro
    return this.testData[index]; // Retornar el registro actualizado
  }

  // Sobrescribir el método delete
  async delete(id: number): Promise<RowType> {
    if (this.testError) {
      throw this.testError; // Lanzar error si hay un error configurado
    }
    const index = this.testData.findIndex((item) => (item as any).id === id); // Buscar el índice del registro
    if (index === -1) throw new Error('Record not found'); // Lanzar error si no se encuentra
    const deletedData = this.testData.splice(index, 1); // Eliminar el registro
    return deletedData[0]; // Retornar el registro eliminado
  }
}
