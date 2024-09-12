export interface User {
    id: number;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    hasWithdrawalPin: string;
    isNotificationEnabled: boolean;
    isBiometricsEnabled: boolean;
    role: UserRole;
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