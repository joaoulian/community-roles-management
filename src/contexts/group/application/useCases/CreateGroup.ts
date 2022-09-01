import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';

import { GroupAggregate } from '../../domain/aggregates/group/GroupAggregate';
import { GroupName } from '../../domain/aggregates/group/GroupName';
import { GroupRepository } from '../../domain/repositories/GroupRepository';
import { PersonActor } from '../actors/Person';

interface IRequest {
  name: string;
  description: string;
}

interface IResponse {
  id: string;
}

export class CreateGroupUseCase implements UseCase<IRequest, IResponse> {
  constructor(private groupRepository: GroupRepository) {}

  async execute(
    person: PersonActor,
    request: IRequest,
  ): Promise<Either<IResponse, CreateGroupValidationError>> {
    const groupOrError = this.createGroup(person, request);
    if (groupOrError.isFailure()) {
      return failure(groupOrError.value);
    }
    const createdGroup = groupOrError.value;
    await this.groupRepository.save(createdGroup);
    return success({ id: createdGroup.id.toString() });
  }

  private createGroup(
    person: PersonActor,
    request: IRequest,
  ): Either<GroupAggregate, CreateGroupValidationError> {
    try {
      const name = GroupName.create(request.name);
      const description = GroupName.create(request.description);
      return success(GroupAggregate.create(name, description, person.id));
    } catch (error) {
      return failure(new CreateGroupValidationError((error as any).message));
    }
  }
}

export class CreateGroupValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
