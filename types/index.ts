// types/index.ts
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export interface Reservation {
  facility?: string;
  date?: string;     // e.g. "2025-08-25"
  time?: string;     // e.g. "13:00-14:00"
  user_id?: number;
}