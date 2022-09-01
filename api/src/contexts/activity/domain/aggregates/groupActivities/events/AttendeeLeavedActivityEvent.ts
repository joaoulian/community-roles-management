import { DomainEvent } from '@core/domain/DomainEvent';

import { Activity } from '../Activity';
import { GroupID } from '../../GroupID';
import { PersonID } from '../../PersonID';

export interface AttendeeLeavedActivityEventPayload {
  groupId: string;
  activityId: string;
  personId: string;
}

export class AttendeeLeavedActivityEvent extends DomainEvent<
  GroupID,
  AttendeeLeavedActivityEventPayload
> {
  constructor(groupId: GroupID, activity: Activity, personId: PersonID) {
    super(groupId, {
      groupId: groupId.toString(),
      activityId: activity.id.toString(),
      personId: personId.toString(),
    });
  }
}
