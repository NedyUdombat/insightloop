import type { Environment, FeedbackStatus } from "@/generated/prisma/enums";
import type { IEndUser } from "./IEndUser";
import type { IModel } from "./IModel";

export interface IFeedback extends IModel {
  projectId: string;
  endUserId: string;
  rating: number | null; // Rating from 1-5
  title: string | null; // Optional title for the feedback
  message: string; // Main feedback message
  additionalInfo: string | null; // Any additional information
  status: FeedbackStatus;
  properties: any; // Developer-provided custom properties
  metadata: any; // System-generated metadata (location, device, IP, host, URL, etc.)
  environment: Environment;
  endUser?: Partial<IEndUser> | null;
  feedbackTimestamp: Date | null;
}

export interface PublicFeedback {
  id: string;
  rating: number | null; // Rating from 1-5
  title: string | null; // Optional title
  message: string; // Main feedback message
  additionalInfo: string | null; // Additional information
  status: FeedbackStatus;
  properties: Record<string, unknown> | null; // Developer-provided custom properties
  metadata: Record<string, unknown> | null; // System-generated metadata
  createdAt: string;
  updatedAt: string;
  endUser: Partial<IEndUser> | null;
  endUserId: string | null;
  environment: Environment;
  feedbackTimestamp: Date | null;
}
