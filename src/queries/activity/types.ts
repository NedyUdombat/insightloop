import type { PublicEvent } from "@/api/types/IEvent";
import type { PublicFeedback } from "@/api/types/IFeedback";

export type RecentActivity =
  | (PublicEvent & { type: "event"; timestamp: string })
  | (PublicFeedback & { type: "feedback"; timestamp: string });
