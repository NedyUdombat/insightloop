import { PrismaClient } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";

class EventService {
  async createEvent({
    tx,
    eventName,
    eventTimeStamp,
    properties,
    projectId,
    endUserId,
  }: {
    projectId: string;
    eventName: string;
    eventTimeStamp: Date;
    properties: any;
    endUserId?: string | null;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;

    return db.event.create({
      data: {
        projectId,
        endUserId,
        eventName,
        eventTimeStamp,
        properties,
      },
    });
  }
}

export default EventService;
