import type { PrismaClient } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";
import type { Prisma } from "@/generated/prisma/browser";
import type {
  ProjectInclude,
  ProjectOrderByWithRelationInput,
  ProjectWhereInput,
} from "@/generated/prisma/models/Project";
import type { IProject, PublicProject } from "../types/IProject";

const MAX_PROJECTS_PER_USER = 5;

class ProjectService {
  async createProject({
    name,
    ownerId,
    eventNotifications,
    feedbackNotifications,
    systemNotifications,
    securityNotifications,
    autoArchive,
    retentionDays,
    defaultEnvironment,
    tx,
  }: {
    name: string;
    ownerId: string;
    eventNotifications?: boolean;
    feedbackNotifications?: boolean;
    systemNotifications?: boolean;
    securityNotifications?: boolean;
    autoArchive?: boolean;
    retentionDays?: number;
    defaultEnvironment?: string;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return db.project.create({
      data: {
        name,
        ownerId,
        eventNotifications,
        feedbackNotifications,
        systemNotifications,
        securityNotifications,
        autoArchive,
        retentionDays,
        defaultEnvironment,
      },
    });
  }

  async findProjects({
    where,
    take,
    skip,
    orderBy,
    select,
    tx,
  }: {
    where: ProjectWhereInput;
    take: number;
    skip: number;
    orderBy:
      | ProjectOrderByWithRelationInput
      | ProjectOrderByWithRelationInput[]
      | undefined;
    tx?: PrismaClient;
    select?: Prisma.ProjectSelect;
  }) {
    const db = tx ?? prisma;
    return db.project.findMany({
      where,
      take,
      skip,
      orderBy,
      select,
    });
  }

  async countProjects({
    where,
    tx,
  }: {
    where: ProjectWhereInput;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return db.project.count({
      where,
    });
  }

  async findProject({
    where,
    tx,
    include,
    select,
  }: {
    where: ProjectWhereInput;
    tx?: PrismaClient;
    include?: ProjectInclude;
    select?: Prisma.ProjectSelect;
  }) {
    const db = tx ?? prisma;

    return db.project.findFirst({
      where,
      include,
      select,
    });
  }

  async updateProject({
    where,
    data,
    tx,
  }: {
    where: ProjectWhereInput;
    data: Prisma.ProjectUpdateInput;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return db.project.update({
      where,
      data,
    });
  }

  async deleteProject({
    id,
    ownerId,
    tx,
  }: {
    id: string;
    ownerId: string;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return db.project.update({
      where: { id, ownerId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async assertOwnership({
    projectId,
    userId,
    tx,
  }: {
    projectId: string;
    userId: string;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;

    const project = await db.project.findFirst({
      where: {
        // id_ownerId_deletedAt: {
        id: projectId,
        ownerId: userId,
        deletedAt: null,
        // },
      },
    });

    if (!project) {
      const error = new Error("Project not found") as Error & {
        statusCode?: number;
      };
      error.statusCode = 404;
      throw error;
    }

    return project;
  }

  async canCreateProject({
    userId,
    tx,
  }: {
    userId: string;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;

    const count = await db.project.count({
      where: { ownerId: userId, deletedAt: null },
    });

    if (count >= MAX_PROJECTS_PER_USER) {
      throw new Error("PROJECT_LIMIT_REACHED");
    }
  }

  async serializeProject(project: IProject): Promise<PublicProject> {
    return {
      id: project.id,
      name: project.name,
      ownerId: project.ownerId,
      eventNotifications: project.eventNotifications,
      feedbackNotifications: project.feedbackNotifications,
      systemNotifications: project.systemNotifications,
      securityNotifications: project.securityNotifications,
      autoArchive: project.autoArchive,
      retentionDays: project.retentionDays,
      defaultEnvironment: project.defaultEnvironment,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      apiKeys: project.apiKeys,
      eventsCount: project?._count?.events,
      feedbackCount: project?._count?.feedbacks,
    } as PublicProject;
  }
}

export default ProjectService;
