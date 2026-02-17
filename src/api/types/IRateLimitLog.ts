import { type IModel } from "./IModel";

export interface IRateLimitLog extends IModel {
  key: string;
  identifier: string;
}
