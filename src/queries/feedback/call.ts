import type { PublicFeedback } from "@/api/types/IFeedback";
import { request } from "../helpers/request";
import type { GetFeedbacksParams, UpdateFeedbackStatusParams } from "./types";

export async function getFeedbacks(
  params: GetFeedbacksParams,
): Promise<GenericResponse<PublicFeedback[]>> {
  const {
    projectId,
    page,
    limit,
    search,
    status,
    environment,
    rating,
    endUserId,
  } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (environment) queryParams.append("environment", environment);
  if (rating) queryParams.append("rating", rating.toString());
  if (endUserId) queryParams.append("endUserId", endUserId);

  const url = `/projects/${projectId}/feedbacks?${queryParams.toString()}`;
  return request<PublicFeedback[]>("GET", url);
}

export async function getFeedback(
  projectId: string,
  feedbackId: string,
): Promise<GenericResponse<PublicFeedback>> {
  return request<PublicFeedback>(
    "GET",
    `/projects/${projectId}/feedbacks/${feedbackId}`,
  );
}

export async function updateFeedbackStatus(
  params: UpdateFeedbackStatusParams,
): Promise<GenericResponse<PublicFeedback>> {
  const { projectId, feedbackId, status } = params;
  return request<PublicFeedback>(
    "PATCH",
    `/projects/${projectId}/feedbacks/${feedbackId}`,
    { status },
  );
}
