import type { PublicProject } from "@/api/types/IProject";
import { request } from "../helpers/request";
import type {
  CountProjectEventsResponse,
  CreateProjectPayload,
  CreateProjectResponse,
  DeleteProjectResponse,
  GetProjectFirstEventResponse,
  UpdateProjectPayload,
  UpdateProjectResponse,
} from "./types";

export async function getProjectList(): Promise<
  GenericResponse<PublicProject[]>
> {
  return request<PublicProject[]>("GET", "/projects");
}

export async function createProject(
  payload: CreateProjectPayload,
): Promise<GenericResponse<CreateProjectResponse>> {
  return request<CreateProjectResponse>("POST", "/projects", payload);
}

export async function getProjectById(
  projectId: string,
): Promise<GenericResponse<PublicProject>> {
  return request<PublicProject>("GET", `/projects/${projectId}`);
}

export async function countProjectEvents(
  projectId: string,
): Promise<GenericResponse<CountProjectEventsResponse>> {
  return request<CountProjectEventsResponse>(
    "GET",
    `/projects/${projectId}/events/count`,
  );
}

export async function getProjectFirstEvent(
  projectId: string,
): Promise<GenericResponse<GetProjectFirstEventResponse>> {
  return request<GetProjectFirstEventResponse>(
    "GET",
    `/projects/${projectId}/events/first`,
  );
}

export async function updateProject(
  payload: UpdateProjectPayload,
): Promise<GenericResponse<UpdateProjectResponse>> {
  return request<UpdateProjectResponse>(
    "PATCH",
    `/projects/${payload.projectId}`,
    {
      name: payload.name,
      autoArchive: payload.preferences?.autoArchive,
      eventNotifications: payload.preferences?.eventNotifications,
      feedbackNotifications: payload.preferences?.feedbackNotifications,
      systemNotifications: payload.preferences?.systemNotifications,
      securityNotifications: payload.preferences?.securityNotifications,
      retentionDays: payload.preferences?.retentionDays,
      defaultEnvironment: payload.preferences?.defaultEnvironment,
    },
  );
}

export async function deleteProject(
  projectId: string,
): Promise<GenericResponse<DeleteProjectResponse>> {
  return request<DeleteProjectResponse>("DELETE", `/projects/${projectId}`);
}
