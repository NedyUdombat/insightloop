import type { Prisma, PrismaClient } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";
import type { Environment } from "@/generated/prisma/enums";
import type { IEvent } from "../types/IEvent";

class EventService {
  async createEvent({
    tx,
    eventName,
    eventTimeStamp,
    properties,
    projectId,
    endUserId,
    environment,
  }: {
    projectId: string;
    eventName: string;
    eventTimeStamp: Date;
    properties: Record<string, unknown> | null;
    endUserId?: string | null;
    tx?: PrismaClient;
    environment: Environment;
  }) {
    const db = tx ?? prisma;

    return db.event.create({
      data: {
        projectId,
        endUserId,
        eventName,
        eventTimestamp: eventTimeStamp,
        properties,
        environment,
      },
    });
  }

  async countEvents({
    projectId,
    startDate,
    endDate,
  }: {
    projectId: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const whereClause: Prisma.EventWhereInput = {
      projectId,
    };

    if (startDate) {
      whereClause.eventTimeStamp = { gte: startDate };
    }

    if (endDate) {
      whereClause.eventTimeStamp = {
        ...whereClause.eventTimeStamp,
        lte: endDate,
      };
    }

    return prisma.event.count({
      where: whereClause,
    });
  }

  async getFirstEvent({ projectId }: { projectId: string }) {
    return prisma.event.findFirst({
      where: { projectId },
      orderBy: { eventTimestamp: "asc" },
      select: {
        id: true,
        eventName: true,
        eventTimestamp: true,
        projectId: true,
        properties: true,
        metadata: true,
        endUserId: true,
        environment: true,
        createdAt: true,
      },
    });
  }

  async getRecentEvents({
    projectId,
    limit = 10,
  }: {
    projectId: string;
    limit?: number;
  }) {
    const events = prisma.event.findMany({
      where: { projectId },
      orderBy: { eventTimestamp: "desc" },
      take: limit,
      select: {
        id: true,
        eventName: true,
        eventTimestamp: true,
        projectId: true,
        properties: true,
        metadata: true,
        endUserId: true,
        environment: true,
        createdAt: true,
        deletedAt: true,
        updatedAt: true,
        endUser: {
          select: {
            id: true,
            name: true,
            email: true,
            externalUserId: true,
          },
        },
      },
    }) as unknown as IEvent[];

    return events;
  }

  async getEvents({
    projectId,
    page = 1,
    limit = 25,
    search,
    eventName,
    startDate,
    endDate,
    endUserId,
  }: {
    projectId: string;
    page?: number;
    limit?: number;
    search?: string;
    eventName?: string;
    startDate?: string;
    endDate?: string;
    endUserId?: string;
  }) {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.EventWhereInput = {
      projectId,
    };

    if (search) {
      whereClause.OR = [
        { eventName: { contains: search, mode: "insensitive" as const } },
        {
          endUser: {
            OR: [
              { email: { contains: search, mode: "insensitive" as const } },
              { name: { contains: search, mode: "insensitive" as const } },
              {
                externalUserId: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          },
        },
      ];
    }

    if (eventName) {
      whereClause.eventName = eventName;
    }

    if (endUserId) {
      whereClause.endUserId = endUserId;
    }

    if (startDate || endDate) {
      whereClause.eventTimestamp = {};
      if (startDate) {
        whereClause.eventTimestamp.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.eventTimestamp.lte = new Date(endDate);
      }
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: whereClause,
        skip,
        take: limit + 1, // Fetch one extra to check if there are more
        orderBy: { eventTimestamp: "desc" },

        select: {
          id: true,
          eventName: true,
          eventTimestamp: true,
          projectId: true,
          properties: true,
          metadata: true,
          endUserId: true,
          environment: true,
          createdAt: true,
          endUser: {
            select: {
              id: true,
              name: true,
              email: true,
              externalUserId: true,
            },
          },
        },
      }),
      prisma.event.count({ where: whereClause }),
    ]);

    const hasMore = events.length > limit;
    const items = hasMore ? events.slice(0, limit) : events;

    return {
      events: items as IEvent[],
      total,
      hasMore,
      page,
      limit,
    };
  }

  serializeEvent(event: IEvent) {
    return {
      id: event.id,
      eventName: event.eventName,
      eventTimestamp: event.eventTimestamp?.toISOString(),
      projectId: event.projectId,
      properties: event.properties,
      metadata: event.metadata,
      endUserId: event.endUserId,
      endUser: event.endUser
        ? {
            id: event.endUser.id,
            name: event.endUser.name,
            email: event.endUser.email,
            externalUserId: event.endUser.externalUserId,
          }
        : null,
      environment: event.environment,
      createdAt: event.createdAt?.toISOString(),
      updatedAt: event.updatedAt,
      deletedAt: event.deletedAt,
    };
  }
}

export default EventService;
