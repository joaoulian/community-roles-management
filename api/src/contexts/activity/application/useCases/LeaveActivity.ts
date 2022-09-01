import { ActivityID } from '@activity/domain/aggregates/groupActivities/ActivityID';
import { GroupID } from '@activity/domain/aggregates/GroupID';
import { GroupActivitiesRepository } from '@activity/domain/repositories/GroupActivitiesRepository';
import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';

import { MemberActor } from '../actors/Member';

import { GroupNotFoundError, UserMustBeMemberOfTheGroupError } from './errors';

interface IRequest {
  activityId: string;
  groupId: string;
}

interface IResponse {}

export class LeaveActivityUseCase implements UseCase<IRequest, IResponse> {
  constructor(private groupActivitiesRepository: GroupActivitiesRepository) {}

  async execute(
    memberActor: MemberActor,
    request: IRequest,
  ): Promise<Either<IResponse, LeaveActivityValidationError | UserMustBeMemberOfTheGroupError>> {
    const groupId = new GroupID(request.groupId);
    const group = await this.groupActivitiesRepository.getById(groupId);

    const activityId = new ActivityID(request.activityId);

    if (!group) {
      return failure(new GroupNotFoundError(request.groupId));
    }

    if (!group.id.equals(memberActor.props.groupId))
      return failure(
        new UserMustBeMemberOfTheGroupError(group.id.toString(), memberActor.id.toString()),
      );

    try {
      group.leaveActivity(memberActor.id, activityId);

      await this.groupActivitiesRepository.save(group);
      return success({});
    } catch (error) {
      return failure(new LeaveActivityValidationError((error as any).message));
    }
  }
}

export class LeaveActivityValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
