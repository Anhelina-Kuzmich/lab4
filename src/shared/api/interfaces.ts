export interface Readable<T> {
  getAll(params?: {
    limit?: number;
    skip?: number;
    query?: string;
  }): Promise<{ items: T[]; total: number }>;
  getById(id: number): Promise<T>;
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>;
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>;
}

export interface Deletable {
  delete(id: number): Promise<void>;
}

export interface Searchable<T> {
  search(
    query: string,
    params?: { limit?: number; skip?: number }
  ): Promise<{ items: T[]; total: number }>;
}
