import { UseCase } from '@core/application/UseCase';
import { GroupID } from '@group/domain/aggregates/group/GroupID';
import { Either, failure, success } from '@core/domain/Either';

import { GroupRepository } from '../../domain/repositories/GroupRepository';
import { MemberActor } from '../actors/Member';

import { GroupNotFoundError } from './errors';

interface IRequest {
  groupId: string;
}

interface IResponse {}

export class LeaveGroupUseCase implements UseCase<IRequest, IResponse> {
  constructor(private groupRepository: GroupRepository) {}

  async execute(
    member: MemberActor,
    request: IRequest,
  ): Promise<Either<IResponse, GroupNotFoundError>> {
    const groupId = new GroupID(request.groupId);
    const group = await this.groupRepository.getById(groupId);
    if (!group) {
      return failure(new GroupNotFoundError(request.groupId));
    }
    group.leaveMember(member.id);
    await this.groupRepository.save(group);
    return success({});
  }
}
