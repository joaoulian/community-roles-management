import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';
import { Name } from '@core/domain/valueObjects/Name';
import { AllowedUser, UsernameType } from '@roles/domain/aggregates/role/AllowedUser';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { Permission } from '@roles/domain/aggregates/role/Permission';
import { Role } from '@roles/domain/aggregates/role/Role';
import { RoleID } from '@roles/domain/aggregates/role/RoleID';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

import { MemberActor } from '../actors/Member';

import { convertStringToPermission } from './utils/convertStringToPermission';

export interface IRequest {
  roleId: string;
  permissions?: string[];
  name?: string;
}

interface IResponse {}

export class UpdateRole implements UseCase<IRequest, IResponse> {
  constructor(private roleRepository: RoleRepository) {}

  async execute(
    _actor: MemberActor,
    request: IRequest,
  ): Promise<Either<IResponse, CreateRoleValidationError>> {
    try {
      const roleId = new RoleID(request.roleId);
      const role = await this.roleRepository.getById(roleId);
      if (role === null) return failure(new RoleNotFounded(request.roleId));

      if (request.permissions) {
        const permissions = request.permissions.reduce((acc, permissionDto) => {
          const converted = convertStringToPermission(permissionDto);
          if (converted) acc.push(converted);
          return acc;
        }, [] as Permission[]);

        if (permissions.length !== request.permissions.length)
          throw new InvalidPermissions(request.permissions);

        role.updatePermissions(permissions);
      }

      if (request.name) {
        const name = Name.create(request.name);
        role.name = name;
      }

      await this.roleRepository.save(role);

      return success({});
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

export class RoleNotFounded extends Error {
  constructor(readonly roleId: string) {
    super('Role not founded');
  }
}

export class InvalidPermissions extends Error {
  constructor(readonly permissions: string[]) {
    super('Invalid permissions');
  }
}
