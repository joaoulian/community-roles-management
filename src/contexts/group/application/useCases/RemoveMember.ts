import { UseCase } from '@core/application/UseCase';
import { GroupID } from '@group/domain/aggregates/group/GroupID';
import { PersonID } from '@group/domain/aggregates/group/PersonID';
import { Either, failure, success } from '@core/domain/Either';

import { GroupRepository } from '../../domain/repositories/GroupRepository';
import { GroupAdminActor } from '../actors/GroupAdmin';

import { GroupNotFoundError, UserMustBeGroupAdminError } from './errors';

interface IRequest {
  groupId: string;
  personId: string;
}

interface IResponse {}

export class RemoveMemberUseCase implements UseCase<IRequest, IResponse> {
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

    const personId = new PersonID(request.personId);

    group.removeMember(personId);
    await this.groupRepository.save(group);
    return success({});
  }
}
