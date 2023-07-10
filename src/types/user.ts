export interface User {
    id: number;
    email: string | null;
    userName: string | null;
    firstName: string | null;
    lastName: string | null;
    role?: UserRole | null;
    status: any;
    deletedAt: string | null;
  }
export type UserType = {
    role: UserRole
}

export type UserRole = {
    id: number;
    name: string;
}