export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  subscriptionId: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}
