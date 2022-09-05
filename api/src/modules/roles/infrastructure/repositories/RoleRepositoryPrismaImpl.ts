import { Name } from '@core/domain/valueObjects/Name';
import {
  PrismaClient,
  Role as PersistanceRole,
  AllowedUser as PersistanceAllowedUser,
} from '@prisma/client';
import { AllowedUser, UsernameType } from '@roles/domain/aggregates/role/AllowedUser';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { Permission } from '@roles/domain/aggregates/role/Permission';
import { Role } from '@roles/domain/aggregates/role/Role';
import { RoleID } from '@roles/domain/aggregates/role/RoleID';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

export class RoleRepositoryPrismaImpl implements RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(role: Role): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.role.upsert({
        where: { id: role.id.toString() },
        create: {
          communityId: role.communityId.toString(),
          name: role.name.value,
          id: role.id.toString(),
          permissions: role.permissions,
        },
        update: {
          name: role.name.value,
          permissions: role.permissions,
        },
      }),
      this.prisma.allowedUser.createMany({
        data: role.allowList.map((allowedUser) => ({
          roleId: role.id.toString(),
          username: allowedUser.username,
          usernameType: allowedUser.usernameType,
        })),
        skipDuplicates: true,
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
        allowList: true,
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
        allowList: true,
      },
    });

    if (dbData) return this.convertPersistanceDataToDomain(dbData);
    return null;
  }

  private convertPersistanceDataToDomain(
    item: PersistanceRole & {
      allowList: PersistanceAllowedUser[];
    },
  ): Role {
    const communityId = new CommunityID(item.communityId);
    const id = new RoleID(item.id);
    const name = Name.create(item.name);

    const allowList = item.allowList.map((allowedUser) => {
      const usernameType = this.convertStringToUsernameType(allowedUser.usernameType);
      return AllowedUser.create({
        username: allowedUser.username,
        usernameType: usernameType ?? UsernameType.Twitter,
      });
    });

    const permissions = item.permissions.reduce((acc, permissionDto) => {
      const converted = this.convertStringToPermission(permissionDto);
      if (converted) acc.push(converted);
      return acc;
    }, [] as Permission[]);

    return Role.create(
      {
        communityId,
        name,
        allowList,
        permissions,
      },
      id,
    );
  }

  private convertStringToPermission(value: string): Permission | undefined {
    return Object.values(Permission).find((enumValue) => enumValue === value);
  }

  private convertStringToUsernameType(value: string): UsernameType | undefined {
    return Object.values(UsernameType).find((enumValue) => enumValue === value);
  }
}
