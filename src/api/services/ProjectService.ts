import { prisma } from "@/api/lib/db";
import { PrismaClient } from "@prisma/client/extension";
import {
  ProjectOrderByWithRelationInput,
  ProjectWhereInput,
  ProjectWhereUniqueInput,
} from "@/generated/prisma/models/Project";

class ProjectService {
  async createProject({
    name,
    ownerId,
    createdById,
    tx,
  }: {
    name: string;
    ownerId: string;
    createdById: string;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return db.project.create({
      data: {
        name,
        ownerId,
        createdById,
      },
    });
  }

  async findProjects({
    where,
    take,
    skip,
    orderBy,
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
  }) {
    const db = tx ?? prisma;
    return db.project.findMany({
      where,
      take,
      skip,
      orderBy,
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

  async findProjectById({
    where,
    tx,
  }: {
    where: ProjectWhereInput;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;

    return db.project.findFirst({
      where,
    });
  }

  async updateProject({
    where,
    data,
    tx,
  }: {
    where: ProjectWhereUniqueInput;
    data: any;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return db.project.update({
      where,
      data,
    });
  }

  async deleteProject({ id, tx }: { id: string; tx?: PrismaClient }) {
    const db = tx ?? prisma;
    return db.user.update({
      where: { id },
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

    const project = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId, deletedAt: null },
    });

    if (!project) throw new Error("Forbidden.");

    return project;
  }
}

export default ProjectService;
