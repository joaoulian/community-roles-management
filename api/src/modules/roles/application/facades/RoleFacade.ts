import { ChannelPermission, CommunityPermission } from '@roles/domain/aggregates/role/Permission';
import { RoleQueryModel } from '@roles/infrastructure/query/RoleQueryModel';

export class RoleFacade {
  constructor(private roleQueryModel: RoleQueryModel) {}

  public static readonly CommunityPermission = CommunityPermission;
  public static readonly ChannelPermission = ChannelPermission;

  async getUserPermissions(userId: string): Promise<UserPermissions> {
    const permissionsMap = await this.roleQueryModel.getUserPermissions(userId);
    return permissionsMap;
  }
}

interface UserPermissions {
  [communityOrChannelId: string]: string[];
}
