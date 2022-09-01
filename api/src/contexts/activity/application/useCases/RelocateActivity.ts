import { ActivityID } from '@activity/domain/aggregates/groupActivities/ActivityID';
import { Address } from '@activity/domain/aggregates/groupActivities/Address';
import { GroupID } from '@activity/domain/aggregates/GroupID';
import { GroupActivitiesRepository } from '@activity/domain/repositories/GroupActivitiesRepository';
import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';

import { GroupAdminActor } from '../actors/GroupAdmin';

import { GroupNotFoundError, UserMustBeGroupAdminError } from './errors';

interface IRequest {
  activityId: string;
  groupId: string;
  location: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  };
}

interface IResponse {}

export class RelocateActivityUseCase implements UseCase<IRequest, IResponse> {
  constructor(private groupActivitiesRepository: GroupActivitiesRepository) {}

  async execute(
    groupAdminActor: GroupAdminActor,
    request: IRequest,
  ): Promise<Either<IResponse, UserMustBeGroupAdminError | RelocateActivityValidationError>> {
    const groupId = new GroupID(request.groupId);
    const group = await this.groupActivitiesRepository.getById(groupId);

    const activityId = new ActivityID(request.activityId);

    if (!group) {
      return failure(new GroupNotFoundError(request.groupId));
    }

    if (!group.id.equals(groupAdminActor.props.groupId)) {
      return failure(new UserMustBeGroupAdminError(request.groupId, groupAdminActor.id.toString()));
    }

    try {
      const location = Address.create(request.location);

      group.relocateActivity(activityId, location, groupAdminActor.id);

      await this.groupActivitiesRepository.save(group);
      return success({});
    } catch (error) {
      return failure(new RelocateActivityValidationError((error as any).message));
    }
  }
}

export class RelocateActivityValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
