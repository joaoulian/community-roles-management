import { PrismaClient } from '@prisma/client';

export class RoleQueryModel {
  constructor(private readonly prisma: PrismaClient) {}

  async getRoleById(id: string) {
    return this.prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        permissions: true,
        users: true,
      },
    });
  }

  async getRolesByCommunityId(id: string) {
    return this.prisma.role.findMany({
      where: {
        communityId: id,
      },
      include: {
        permissions: true,
        users: true,
      },
    });
  }

  async getUserPermissions(userId: string): Promise<UserPermissionsMap> {
    const userRoles = await this.prisma.usersOnRoles.findMany({
      where: {
        userId,
      },
      include: {
        Role: {
          include: {
            permissions: true,
          },
        },
      },
    });
    if (!userRoles) return {};

    const response: UserPermissionsMap = {};
    userRoles.map((userRole) => {
      const permissions = userRole.Role.permissions;

      permissions.forEach((list) => {
        const resourceId = list.channelId ?? list.communityId;

        if (resourceId) {
          if (!response[resourceId]) response[resourceId] = [];
          response[resourceId] = [...new Set([...response[resourceId], ...list.permissions])];
        }
      });
    });

    return response;
  }
}

interface UserPermissionsMap {
  [id: string]: string[];
}
