import { PrismaClient } from '@prisma/client';

export class RoleQueryModel {
  constructor(private readonly prisma: PrismaClient) {}

  async getRolesByCommunityId(communityId: string) {
    return this.prisma.role.findMany({
      where: {
        communityId,
      },
      include: {
        allowList: true,
      },
    });
  }

  async getRoleById(id: string) {
    return this.prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        allowList: true,
      },
    });
  }
}
