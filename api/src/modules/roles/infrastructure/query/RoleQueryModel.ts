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
      },
    });
  }
}
