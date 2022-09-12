import { Permissions, PrismaClient, Role as PersistanceRole, UserRoles } from '@prisma/client';
import { ChannelPermissions } from '@roles/domain/aggregates/role/ChannelPermissions';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { CommunityPermissions } from '@roles/domain/aggregates/role/CommunityPermissions';
import { Role } from '@roles/domain/aggregates/role/Role';
import { RoleID } from '@roles/domain/aggregates/role/RoleID';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

import { RoleRepositoryPrismaMapper } from './RoleRepositoryPrismaMapper';

export class RoleRepositoryPrismaImpl implements RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(role: Role): Promise<void> {
    const communityPermissions: CommunityPermissions[] = role.permissions.filter(
      (permissions): permissions is CommunityPermissions =>
        permissions instanceof CommunityPermissions,
    );
    const channelPermissions: ChannelPermissions[] = role.permissions.filter(
      (permissions): permissions is ChannelPermissions => permissions instanceof ChannelPermissions,
    );

    await this.prisma.$transaction([
      this.prisma.role.upsert({
        where: {
          id: role.id.toString(),
        },
        update: {
          communityId: role.communityId.toString(),
          name: role.name.value,
        },
        create: {
          id: role.id.toString(),
          communityId: role.communityId.toString(),
          name: role.name.value,
        },
      }),
      this.prisma.userRoles.createMany({
        data: role.users.map((userId) => ({
          roleId: role.id.toValue(),
          userId: userId.toValue(),
        })),
        skipDuplicates: true,
      }),
      ...communityPermissions.map((permissions) => {
        return this.prisma.permissions.upsert({
          where: {
            community_permissions_identifier: {
              communityId: permissions.communityId.toValue(),
              roleId: role.id.toValue(),
            },
          },
          update: {
            list: permissions.list,
          },
          create: {
            roleId: role.id.toString(),
            channelId: undefined,
            communityId: permissions.communityId.toValue(),
            list: permissions.list,
          },
        });
      }),
      ...channelPermissions.map((permissions) => {
        return this.prisma.permissions.upsert({
          where: {
            channel_permissions_identifier: {
              channelId: permissions.channelId.toValue(),
              roleId: role.id.toValue(),
            },
          },
          update: {
            list: permissions.list,
          },
          create: {
            roleId: role.id.toString(),
            communityId: undefined,
            channelId: permissions.channelId.toValue(),
            list: permissions.list,
          },
        });
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
        users: true,
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
        users: true,
      },
    });

    if (dbData) return this.convertPersistanceDataToDomain(dbData);
    return null;
  }

  private convertPersistanceDataToDomain(
    db: PersistanceRole & {
      permissions: Permissions[];
      users: UserRoles[];
    },
  ): Role {
    return RoleRepositoryPrismaMapper.toDomain(db);
  }
}
