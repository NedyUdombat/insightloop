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
  properties: Record<string, any> | null; // Developer-provided custom properties
  metadata: Record<string, any> | null; // System-generated metadata (location, device, IP, host, URL, etc.)
  environment: Environment;
  endUser: IEndUser | null;
}

export interface PublicFeedback {
  id: string;
  rating: number | null; // Rating from 1-5
  title: string | null; // Optional title
  message: string; // Main feedback message
  additionalInfo: string | null; // Additional information
  status: FeedbackStatus;
  properties: Record<string, any> | null; // Developer-provided custom properties
  metadata: Record<string, any> | null; // System-generated metadata
  createdAt: string;
  updatedAt: string;
  endUser: IEndUser | null;
  endUserId: string | null;
  environment: Environment;
}
