export interface Participant {
  id: string;
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

export type SortField = 'name' | 'dateOfBirth';
export type SortOrder = 'asc' | 'desc';