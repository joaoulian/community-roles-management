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
    const userRoles = await this.prisma.userRoles.findMany({
      where: {
        userId,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
    if (!userRoles) return {};

    const response: UserPermissionsMap = {};
    userRoles.map((userRole) => {
      const permissions = userRole.role.permissions;

      permissions.forEach((permissionSet) => {
        const resourceId = permissionSet.channelId ?? permissionSet.communityId;

        if (resourceId) {
          if (!response[resourceId]) response[resourceId] = [];
          response[resourceId] = [...new Set([...response[resourceId], ...permissionSet.list])];
        }
      });
    });

    return response;
  }
}

interface UserPermissionsMap {
  [id: string]: string[];
}
