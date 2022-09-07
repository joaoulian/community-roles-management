import { RoleQueryModel } from '@roles/infrastructure/query/RoleQueryModel';

export class RoleFacade {
  constructor(private roleQueryModel: RoleQueryModel) {}

  async getUserPermissions(userId: string): Promise<UserPermissions> {
    const permissionsMap = await this.roleQueryModel.getUserPermissions(userId);
    return permissionsMap;
  }
}

interface UserPermissions {
  [communityOrChannelId: string]: string[];
}
