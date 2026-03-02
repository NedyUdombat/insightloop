import type { IProject } from "@/api/types/IProject";
import { request } from "../helpers/request";
import type {
  CountProjectEventsResponse,
  CreateProjectPayload,
  CreateProjectResponse,
} from "./types";

export async function getProjectList(): Promise<GenericResponse<IProject[]>> {
  return request<IProject[]>("GET", "/projects");
}

export async function createProject(
  payload: CreateProjectPayload,
): Promise<GenericResponse<CreateProjectResponse>> {
  return request<CreateProjectResponse>("POST", "/projects", payload);
}

export async function getProjectById(
  projectId: string,
): Promise<GenericResponse<IProject>> {
  return request<IProject>("GET", `/projects/${projectId}`);
}

export async function countProjectEvents(
  projectId: string,
): Promise<GenericResponse<CountProjectEventsResponse>> {
  return request<CountProjectEventsResponse>(
    "GET",
    `/projects/${projectId}/events/count`,
  );
}
