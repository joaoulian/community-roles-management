import { ActivityDescription } from '@activity/domain/aggregates/groupActivities/ActivityDescription';
import { ActivityID } from '@activity/domain/aggregates/groupActivities/ActivityID';
import { GroupID } from '@activity/domain/aggregates/GroupID';
import { GroupActivitiesRepository } from '@activity/domain/repositories/GroupActivitiesRepository';
import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';

import { GroupAdminActor } from '../actors/GroupAdmin';

import { GroupNotFoundError, UserMustBeGroupAdminError } from './errors';

interface IRequest {
  activityId: string;
  groupId: string;
  description: string;
}

interface IResponse {}

export class UpdateActivityDescriptionUseCase implements UseCase<IRequest, IResponse> {
  constructor(private groupActivitiesRepository: GroupActivitiesRepository) {}

  async execute(
    groupAdminActor: GroupAdminActor,
    request: IRequest,
  ): Promise<
    Either<IResponse, UserMustBeGroupAdminError | UpdateActivityDescriptionValidationError>
  > {
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
      const description = ActivityDescription.create(request.description);

      group.updateActivityDescription(activityId, description, groupAdminActor.id);

      await this.groupActivitiesRepository.save(group);
      return success({});
    } catch (error) {
      return failure(new UpdateActivityDescriptionValidationError((error as any).message));
    }
  }
}

export class UpdateActivityDescriptionValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
