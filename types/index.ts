// types/index.ts
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface Reservation {
  facility?: string;
  date?: string;
  time?: string;
  user_id?: number;
}