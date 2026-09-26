/** Domain entity representing an authenticated session. */
export interface AuthSession {
  userId: number;
  email: string;
  accessToken: string;
}
