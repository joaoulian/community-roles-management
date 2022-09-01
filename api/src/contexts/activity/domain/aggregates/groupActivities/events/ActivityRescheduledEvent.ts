import { DomainEvent } from '@core/domain/DomainEvent';

import { Activity } from '../Activity';
import { GroupID } from '../../GroupID';
import { PersonID } from '../../PersonID';

interface ActivityEventPayload {
  id: string;
  start: Date;
  end: Date;
}

export interface ActivityRescheduledEventEventPayload {
  groupId: string;
  scheduler: string;
  activity: ActivityEventPayload;
}

export class ActivityRescheduledEventEvent extends DomainEvent<
  GroupID,
  ActivityRescheduledEventEventPayload
> {
  constructor(groupId: GroupID, scheduler: PersonID, activity: Activity) {
    super(groupId, {
      groupId: groupId.toString(),
      scheduler: scheduler.toString(),
      activity: {
        id: activity.id.toString(),
        start: activity.time.start,
        end: activity.time.end,
      },
    });
  }
}
