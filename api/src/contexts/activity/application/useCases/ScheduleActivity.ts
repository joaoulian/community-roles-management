import { ActivityDescription } from '@activity/domain/aggregates/groupActivities/ActivityDescription';
import { Address } from '@activity/domain/aggregates/groupActivities/Address';
import { TimeInterval } from '@activity/domain/aggregates/groupActivities/TimeInterval';
import { GroupID } from '@activity/domain/aggregates/GroupID';
import { GroupActivitiesRepository } from '@activity/domain/repositories/GroupActivitiesRepository';
import { UseCase } from '@core/application/UseCase';
import { Either, failure, success } from '@core/domain/Either';

import { GroupAdminActor } from '../actors/GroupAdmin';

import { GroupNotFoundError, UserMustBeGroupAdminError } from './errors';

interface IRequest {
  groupId: string;
  startDate: Date;
  endDate: Date;
  description: string;
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

export class ScheduleActivityUseCase implements UseCase<IRequest, IResponse> {
  constructor(private groupActivitiesRepository: GroupActivitiesRepository) {}

  async execute(
    groupAdminActor: GroupAdminActor,
    request: IRequest,
  ): Promise<Either<IResponse, UserMustBeGroupAdminError | ScheduleActivityValidationError>> {
    const groupId = new GroupID(request.groupId);
    const group = await this.groupActivitiesRepository.getById(groupId);

    if (!group) {
      return failure(new GroupNotFoundError(request.groupId));
    }

    if (!group.id.equals(groupAdminActor.props.groupId)) {
      return failure(new UserMustBeGroupAdminError(request.groupId, groupAdminActor.id.toString()));
    }

    try {
      const time = TimeInterval.create({ start: request.startDate, end: request.endDate });
      const description = ActivityDescription.create(request.description);
      const location = Address.create(request.location);

      group.scheduleActivity({ time, description, location }, groupAdminActor.id);

      await this.groupActivitiesRepository.save(group);
      return success({});
    } catch (error) {
      return failure(new ScheduleActivityValidationError((error as any).message));
    }
  }
}

export class ScheduleActivityValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
