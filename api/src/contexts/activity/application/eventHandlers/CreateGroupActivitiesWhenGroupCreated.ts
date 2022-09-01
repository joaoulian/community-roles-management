import { GroupActivities } from '@activity/domain/aggregates/groupActivities/GroupActivities';
import { GroupID } from '@activity/domain/aggregates/GroupID';
import { GroupActivitiesRepository } from '@activity/domain/repositories/GroupActivitiesRepository';
import { EventHandler } from '@core/application/EventHandler';
import { DomainEventsBroker } from '@core/domain/DomainEventsBroker';
import { GroupCreatedEvent } from '@group/application/events';

export class CreateGroupActivitiesWhenGroupCreatedEventHandler
  implements EventHandler<GroupCreatedEvent>
{
  constructor(private groupActivitiesRepository: GroupActivitiesRepository) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEventsBroker.register(this.handle.bind(this), GroupCreatedEvent.constructor.name);
  }

  handle = async (event: GroupCreatedEvent): Promise<void> => {
    const groupActivities = GroupActivities.create([], new GroupID(event.aggregateId.toString()));
    await this.groupActivitiesRepository.save(groupActivities);
  };
}
