import { DomainEvent } from '@core/domain/DomainEvent';

import { Activity } from '../Activity';
import { GroupID } from '../../GroupID';
import { PersonID } from '../../PersonID';

export interface ActivityCanceledEventPayload {
  groupId: string;
  canceledBy: string;
  activityId: string;
  attendees: string[];
}

export class ActivityCanceledEvent extends DomainEvent<GroupID, ActivityCanceledEventPayload> {
  constructor(groupId: GroupID, canceledBy: PersonID, activity: Activity) {
    super(groupId, {
      groupId: groupId.toString(),
      canceledBy: canceledBy.toString(),
      activityId: activity.id.toString(),
      attendees: activity.attendees.map((attendee) => attendee.toString()),
    });
  }
}
