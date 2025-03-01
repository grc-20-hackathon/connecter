import * as fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

export class LocalDbHandler<T extends Readonly<Record<string, unknown>>> {
  #filePath = '';
  #defaultValue: T = {} as T;

  constructor(fileName: string, directory: string = 'data') {
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    this.#filePath = path.join(directory, fileName);
  }

  public async read(): Promise<T> {
    try {
      if (existsSync(this.#filePath)) {
        const fileContent = await fs.readFile(this.#filePath, 'utf-8');
        return JSON.parse(fileContent) as T;
      }
      return this.#defaultValue;
    } catch (error) {
      console.error(`Error reading file ${this.#filePath}:`, error);
      throw error;
    }
  }

  public async write(data: T): Promise<void> {
    try {
      await fs.writeFile(this.#filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing to file ${this.#filePath}:`, error);
      throw error;
    }
  }

  public async append(newData: Partial<T>): Promise<void> {
    try {
      const existingData = await this.read();
      const updatedData = { ...existingData, ...newData };
      await this.write(updatedData);
    } catch (error) {
      console.error(`Error appending to file ${this.#filePath}:`, error);
      throw error;
    }
  }
}
