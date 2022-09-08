import { Context } from '@core/application/Context';
import { ForbiddenError } from '@core/application/ForbiddenError';
import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';
import { ChannelID } from '@roles/domain/aggregates/role/ChannelID';
import { ChannelPermissions } from '@roles/domain/aggregates/role/ChannelPermissions';
import { ChannelPermission, CommunityPermission } from '@roles/domain/aggregates/role/Permission';
import { RoleID } from '@roles/domain/aggregates/role/RoleID';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

import { RoleFacade } from '../facades/RoleFacade';

import { convertStringToChannelPermission } from './utils/convertStringToPermission';

export interface IRequest {
  roleId: string;
  channelId: string;
  permissions: string[];
}

interface IResponse {}

export class AddChannelPermissionsToRole implements UseCase<IRequest, IResponse> {
  constructor(private roleRepository: RoleRepository) {}

  canExecute(communityId: string, channelId: string, context?: Context): boolean {
    if (!context) return false;
    const communityPermissions = context.getResourcePermissions(communityId);
    const channelPermissions = context.getResourcePermissions(channelId);

    return (
      communityPermissions.includes(RoleFacade.CommunityPermission.Administrator) ||
      communityPermissions.includes(RoleFacade.CommunityPermission.ManageRoles) ||
      channelPermissions.includes(RoleFacade.ChannelPermission.Administrator) ||
      channelPermissions.includes(RoleFacade.ChannelPermission.ManagePermissions)
    );
  }

  async execute(
    request: IRequest,
    context?: Context,
  ): Promise<Either<IResponse, AddRoleValidationError>> {
    const roleId = new RoleID(request.roleId);
    const role = await this.roleRepository.getById(roleId);
    if (!role) return failure(new RoleNotFounded(request.roleId));

    const canExecute = this.canExecute(role.communityId.toString(), request.channelId, context);
    if (!canExecute) throw new ForbiddenError();

    try {
      const permissionsList = request.permissions.reduce((acc, permissionDto) => {
        const converted = convertStringToChannelPermission(permissionDto);
        if (converted) acc.push(converted);
        return acc;
      }, [] as ChannelPermission[]);

      if (permissionsList.length !== request.permissions.length)
        throw new InvalidPermissions(request.permissions);

      const channelId = new ChannelID(request.channelId);

      const channelPermissions = ChannelPermissions.create({
        channelId,
        communityId: undefined,
        permissions: permissionsList,
      });

      role.addChannelPermissions(channelPermissions);

      this.roleRepository.save(role);

      return success({});
    } catch (error) {
      return failure(new AddRoleValidationError((error as any).message));
    }
  }
}

export class AddRoleValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidPermissions extends Error {
  constructor(readonly permissions: string[]) {
    super('Invalid permissions');
  }
}

export class RoleNotFounded extends Error {
  constructor(readonly roleId: string) {
    super('Role not founded');
  }
}
