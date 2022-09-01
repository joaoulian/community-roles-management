import { DomainEvent } from '@core/domain/DomainEvent';

import { Activity } from '../Activity';
import { GroupID } from '../../GroupID';
import { PersonID } from '../../PersonID';

interface ActivityEventPayload {
  id: string;
  start: Date;
  end: Date;
  description: string;
}

export interface ActivityScheduledEventPayload {
  groupId: string;
  scheduler: string;
  activity: ActivityEventPayload;
}

export class ActivityScheduledEvent extends DomainEvent<GroupID, ActivityScheduledEventPayload> {
  constructor(groupId: GroupID, scheduler: PersonID, activity: Activity) {
    super(groupId, {
      groupId: groupId.toString(),
      scheduler: scheduler.toString(),
      activity: {
        id: activity.id.toString(),
        start: activity.time.start,
        end: activity.time.end,
        description: activity.description.value,
      },
    });
  }
}
