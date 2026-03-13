// End users query types

export interface GetEndUsersParams {
  projectId: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PublicEndUser {
  id: string;
  anonymousId: string;
  firstName: string;
  lastName: string;
  email: string;
  externalUserId: string | null;
  traits: Record<string, any> | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}
