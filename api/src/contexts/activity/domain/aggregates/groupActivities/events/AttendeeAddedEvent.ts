import { DomainEvent } from '@core/domain/DomainEvent';

import { Activity } from '../Activity';
import { GroupID } from '../../GroupID';
import { PersonID } from '../../PersonID';

export interface AttendeeAddedEventPayload {
  groupId: string;
  activityId: string;
  personId: string;
}

export class AttendeeAddedEvent extends DomainEvent<GroupID, AttendeeAddedEventPayload> {
  constructor(groupId: GroupID, activity: Activity, personId: PersonID) {
    super(groupId, {
      groupId: groupId.toString(),
      activityId: activity.id.toString(),
      personId: personId.toString(),
    });
  }
}
