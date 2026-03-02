import type { PublicProject } from "@/api/types/IProject";

export interface CreateProjectPayload {
  name: string;
}

export interface CreateProjectResponse {
  project: PublicProject;
  apiKey: {
    value: string;
    environment: string;
    name: string;
  };
}

export interface CountProjectEventsResponse {
  count: number;
}
