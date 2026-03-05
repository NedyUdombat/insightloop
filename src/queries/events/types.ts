import type { IEvent } from "@/api/types/IEvent";

export interface GetEventsParams {
  projectId: string;
  page?: number;
  limit?: number;
  search?: string;
  eventName?: string;
  startDate?: string;
  endDate?: string;
  endUserId?: string;
}

export interface GetEventsResponse {
  data: IEvent[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
