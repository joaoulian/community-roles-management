import { DomainEvent } from '@core/domain/DomainEvent';

import { Activity } from '../Activity';
import { GroupID } from '../../GroupID';
import { PersonID } from '../../PersonID';

export interface ActivityDescriptionUpdatedEventPayload {
  groupId: string;
  unlockedBy: string;
  activityId: string;
  description: string;
}

export class ActivityDescriptionUpdatedEvent extends DomainEvent<
  GroupID,
  ActivityDescriptionUpdatedEventPayload
> {
  constructor(groupId: GroupID, unlockedBy: PersonID, activity: Activity) {
    super(groupId, {
      groupId: groupId.toString(),
      unlockedBy: unlockedBy.toString(),
      activityId: activity.id.toString(),
      description: activity.description.value,
    });
  }
}
