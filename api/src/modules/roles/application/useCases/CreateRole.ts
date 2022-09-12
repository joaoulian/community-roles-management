import { Context } from '@core/application/Context';
import { ForbiddenError } from '@core/application/ForbiddenError';
import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';
import { Name } from '@core/domain/valueObjects/Name';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { CommunityPermissions } from '@roles/domain/aggregates/role/CommunityPermissions';
import { CommunityPermission } from '@roles/domain/aggregates/role/Permission';
import { Role } from '@roles/domain/aggregates/role/Role';
import { UserID } from '@roles/domain/aggregates/role/UserID';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

import { RoleFacade } from '../facades/RoleFacade';

import { convertStringToCommunityPermission } from './utils/convertStringToPermission';

export interface IRequest {
  communityId: string;
  name: string;
  permissions: string[];
  users: string[];
}

interface IResponse {
  id: string;
}

export class CreateRoleUseCase implements UseCase<IRequest, IResponse> {
  constructor(private roleRepository: RoleRepository) {}

  canExecute(communityId: string, context?: Context): boolean {
    if (!context) return false;
    const permissions = context.getResourcePermissions(communityId);
    return (
      permissions.includes(RoleFacade.CommunityPermission.Administrator) ||
      permissions.includes(RoleFacade.CommunityPermission.ManageRoles)
    );
  }

  async execute(
    request: IRequest,
    context?: Context,
  ): Promise<Either<IResponse, CreateRoleValidationError>> {
    const canExecute = this.canExecute(request.communityId, context);
    if (!canExecute) throw new ForbiddenError();

    try {
      const communityId = new CommunityID(request.communityId);
      const name = Name.create(request.name);

      const permissionsList = request.permissions.reduce((acc, permissionDto) => {
        const converted = convertStringToCommunityPermission(permissionDto);
        if (converted) acc.push(converted);
        return acc;
      }, [] as CommunityPermission[]);

      if (permissionsList.length !== request.permissions.length)
        throw new InvalidPermissions(request.permissions);

      const communityPermissions = CommunityPermissions.create({
        channelId: undefined,
        communityId,
        list: permissionsList,
      });

      const users = request.users.map((userId) => new UserID(userId));

      const role = Role.create({
        communityId,
        name,
        permissions: [communityPermissions],
        users,
      });

      await this.roleRepository.save(role);

      return success({ id: role.id.toString() });
    } catch (error) {
      return failure(new CreateRoleValidationError((error as any).message));
    }
  }
}

export class CreateRoleValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidPermissions extends Error {
  constructor(readonly permissions: string[]) {
    super('Invalid permissions');
  }
}
