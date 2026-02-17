import { type IModel } from "./IModel";
import { FeedbackStatus } from "@/generated/prisma/enums";

export interface IFeedback extends IModel {
  projectId: string;
  endUserId: string;
  message: string;
  status: FeedbackStatus;
}
