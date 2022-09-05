import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

import { MemberActor } from '../actors/Member';

export interface IRequest {
  communityId: string;
}

interface RoleDTO {
  id: string;
  communityId: string;
  name: string;
  permissions: string[];
  allowList: string[];
}

interface IResponse {
  roles: RoleDTO[];
}

export class GetRolesByCommunityId implements UseCase<IRequest, IResponse> {
  constructor(private roleRepository: RoleRepository) {}

  async execute(
    _actor: MemberActor,
    request: IRequest,
  ): Promise<Either<IResponse, CreateRoleValidationError>> {
    try {
      const communityId = new CommunityID(request.communityId);

      const roles = await this.roleRepository.getRolesByCommunityId(communityId);

      return success({
        roles: roles.map((role) => ({
          id: role.id.toValue(),
          communityId: role.communityId.toValue(),
          name: role.name.value,
          permissions: role.permissions,
          allowList: role.allowList.map((allowedUser) => allowedUser.username),
        })),
      });
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
