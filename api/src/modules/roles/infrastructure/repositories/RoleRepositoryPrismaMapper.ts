import { Name } from '@core/domain/valueObjects/Name';
import { Role as PrismaRole, Permissions as PrismaPermissions } from '@prisma/client';
import {
  convertStringToChannelPermission,
  convertStringToCommunityPermission,
} from '@roles/application/useCases/utils/convertStringToPermission';
import { ChannelID } from '@roles/domain/aggregates/role/ChannelID';
import { ChannelPermissions } from '@roles/domain/aggregates/role/ChannelPermissions';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { CommunityPermissions } from '@roles/domain/aggregates/role/CommunityPermissions';
import { ChannelPermission, CommunityPermission } from '@roles/domain/aggregates/role/Permission';
import { Permissions } from '@roles/domain/aggregates/role/Permissions';
import { Role } from '@roles/domain/aggregates/role/Role';
import { RoleID } from '@roles/domain/aggregates/role/RoleID';

export class RoleRepositoryPrismaMapper {
  static toDomain(db: PrismaRole & { permissions: PrismaPermissions[] }): Role {
    const communityId = new CommunityID(db.communityId);
    const id = new RoleID(db.id);
    const name = Name.create(db.name);

    const permissions = db.permissions.reduce((acc, permissionsDto) => {
      try {
        const converted = this.convertPermissions(permissionsDto);
        acc.push(converted);
      } catch (err) {
        console.error(err);
      }

      return acc;
    }, [] as Permissions[]);

    return Role.create(
      {
        communityId,
        name,
        permissions,
      },
      id,
    );
  }

  static convertPermissions(permissions: PrismaPermissions): Permissions {
    if (permissions.type === 'channel') {
      const list = permissions.permissions.reduce((acc, permission) => {
        const converted = convertStringToChannelPermission(permission);
        if (converted) acc.push(converted);
        return acc;
      }, [] as ChannelPermission[]);

      if (!permissions.channelId) throw new Error('Inconsistent channel permissions');

      return ChannelPermissions.create({
        channelId: new ChannelID(permissions.channelId),
        communityId: undefined,
        permissions: list,
      });
    } else if (permissions.type === 'community') {
      const list = permissions.permissions.reduce((acc, permission) => {
        const converted = convertStringToCommunityPermission(permission);
        if (converted) acc.push(converted);
        return acc;
      }, [] as CommunityPermission[]);

      if (!permissions.communityId) throw new Error('Inconsistent community permissions');

      return CommunityPermissions.create({
        channelId: undefined,
        communityId: new CommunityID(permissions.communityId),
        permissions: list,
      });
    }

    throw new Error('Invalid permissions type');
  }
}
