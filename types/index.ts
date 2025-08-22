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