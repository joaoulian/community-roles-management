import { UseCase } from '@core/application/UseCase';
import { GroupDescription } from '@group/domain/aggregates/group/GroupDescription';
import { GroupID } from '@group/domain/aggregates/group/GroupID';
import { GroupName } from '@group/domain/aggregates/group/GroupName';
import { Either, failure, success } from '@core/domain/Either';

import { GroupRepository } from '../../domain/repositories/GroupRepository';
import { GroupAdminActor } from '../actors/GroupAdmin';

import { GroupNotFoundError, UserMustBeGroupAdminError } from './errors';

interface IRequest {
  groupId: string;
  name?: string;
  description?: string;
}

interface IResponse {}

export class EditGroupUseCase implements UseCase<IRequest, IResponse> {
  constructor(private groupRepository: GroupRepository) {}

  async execute(
    groupAdminActor: GroupAdminActor,
    request: IRequest,
  ): Promise<Either<IResponse, GroupNotFoundError | UserMustBeGroupAdminError>> {
    const groupId = new GroupID(request.groupId);
    const group = await this.groupRepository.getById(groupId);

    if (!group) {
      return failure(new GroupNotFoundError(request.groupId));
    }

    if (group.hasAdmin(groupAdminActor.id) === false) {
      return failure(new UserMustBeGroupAdminError(request.groupId, groupAdminActor.id.toString()));
    }

    if (request.name) {
      group.name = GroupName.create(request.name);
    }

    if (request.description) {
      group.description = GroupDescription.create(request.description);
    }

    await this.groupRepository.save(group);
    return success({});
  }
}
