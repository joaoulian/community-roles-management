import { PrismaClient } from '@prisma/client';
import { Role } from '@roles/domain/aggregates/role/Role';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

export class RoleRepositoryPrismaImpl implements RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(role: Role): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.role.create({
        data: {
          communityId: role.communityId.toString(),
          name: role.name.value,
          id: role.id.toString(),
          permissions: role.permissions,
        },
      }),
      this.prisma.allowedUser.createMany({
        data: role.allowList.map((allowedUser) => ({
          roleId: role.id.toString(),
          username: allowedUser.username,
          usernameType: allowedUser.usernameType,
        })),
      }),
    ]);
  }
}
