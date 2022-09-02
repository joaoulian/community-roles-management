import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';
import { Name } from '@core/domain/valueObjects/Name';
import { AllowedUser, UsernameType } from '@roles/domain/aggregates/role/AllowedUser';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { Permission } from '@roles/domain/aggregates/role/Permission';
import { Role } from '@roles/domain/aggregates/role/Role';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

import { MemberActor } from '../actors/Member';

interface IRequest {
  communityId: string;
  name: string;
  permissions: string[];
  allowList: string[];
}

interface IResponse {
  id: string;
}

export class CreateRoleUseCase implements UseCase<IRequest, IResponse> {
  constructor(private roleRepository: RoleRepository) {}

  async execute(
    _actor: MemberActor,
    request: IRequest,
  ): Promise<Either<IResponse, CreateRoleValidationError>> {
    try {
      const communityId = new CommunityID(request.communityId);
      const name = Name.create(request.name);

      const permissions = request.permissions.reduce((acc, permissionDto) => {
        const converted = this.convertStringToPermission(permissionDto);
        if (converted) acc.push(converted);
        return acc;
      }, [] as Permission[]);

      if (permissions.length !== request.permissions.length)
        throw new InvalidPermissions(request.permissions);

      const allowList = request.allowList.map((username) => {
        return AllowedUser.create({ username, usernameType: UsernameType.Twitter });
      });

      const role = Role.create({
        allowList,
        communityId,
        name,
        permissions,
      });

      await this.roleRepository.save(role);

      return success({ id: role.id.toString() });
    } catch (error) {
      return failure(new CreateRoleValidationError((error as any).message));
    }
  }

  private convertStringToPermission(value: string): Permission | undefined {
    return Object.values(Permission).find((enumValue) => enumValue === value);
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
