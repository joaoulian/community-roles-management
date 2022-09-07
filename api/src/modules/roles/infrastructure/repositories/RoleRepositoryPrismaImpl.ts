import { Permissions, PrismaClient, Role as PersistanceRole } from '@prisma/client';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { Role } from '@roles/domain/aggregates/role/Role';
import { RoleID } from '@roles/domain/aggregates/role/RoleID';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

import { RoleRepositoryPrismaMapper } from './RoleRepositoryPrismaMapper';

export class RoleRepositoryPrismaImpl implements RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(role: Role): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.role.create({
        data: {
          id: role.id.toString(),
          communityId: role.communityId.toString(),
          name: role.name.value,
        },
      }),
      this.prisma.permissions.createMany({
        data: role.permissions.map((permissions) => ({
          roleId: role.id.toString(),
          type: permissions.type,
          channelId: permissions.channelId?.toValue(),
          communityId: permissions.communityId?.toValue(),
          permissions: permissions.permissions,
        })),
      }),
    ]);
  }

  async getRolesByCommunityId(communityId: CommunityID): Promise<Role[]> {
    const dbData = await this.prisma.role.findMany({
      where: {
        communityId: communityId.toValue(),
      },
      orderBy: [
        {
          name: 'desc',
        },
      ],
      include: {
        permissions: true,
      },
    });

    return dbData.map((item) => {
      return this.convertPersistanceDataToDomain(item);
    });
  }

  async getById(roleId: RoleID): Promise<Role | null> {
    const dbData = await this.prisma.role.findUnique({
      where: {
        id: roleId.toValue(),
      },
      include: {
        permissions: true,
      },
    });

    if (dbData) return this.convertPersistanceDataToDomain(dbData);
    return null;
  }

  private convertPersistanceDataToDomain(
    db: PersistanceRole & {
      permissions: Permissions[];
    },
  ): Role {
    return RoleRepositoryPrismaMapper.toDomain(db);
  }
}
