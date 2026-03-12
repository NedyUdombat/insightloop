export interface AuthenticatePayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export type VerifyEmailResponse = { hasSession: boolean };
