import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';
import { GroupID } from '@group/domain/aggregates/group/GroupID';

import { GroupRepository } from '../../domain/repositories/GroupRepository';
import { PersonActor } from '../actors/Person';

import { GroupNotFoundError } from './errors';

interface IRequest {
  groupId: string;
}

interface IResponse {}

export class RequestToJoinGroupUseCase implements UseCase<IRequest, IResponse> {
  constructor(private groupRepository: GroupRepository) {}

  async execute(
    person: PersonActor,
    request: IRequest,
  ): Promise<Either<IResponse, GroupNotFoundError>> {
    const groupId = new GroupID(request.groupId);
    const group = await this.groupRepository.getById(groupId);
    if (!group) {
      return failure(new GroupNotFoundError(request.groupId));
    }
    group.addMember(person.id);
    await this.groupRepository.save(group);
    return success({});
  }
}
