export interface AuthTokens {
  access: string;
  refresh: string;
}

export function loginUser(username: string, password: string): Promise<AuthTokens>;
export function logoutUser(): void;
