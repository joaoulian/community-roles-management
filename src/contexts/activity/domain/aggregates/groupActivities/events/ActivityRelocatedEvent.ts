import { DomainEvent } from '@core/domain/DomainEvent';

import { Activity } from '../Activity';
import { GroupID } from '../../GroupID';
import { PersonID } from '../../PersonID';

interface ActivityEventPayload {
  id: string;
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

export interface ActivityRelocatedEventPayload {
  groupId: string;
  adminId: string;
  activity: ActivityEventPayload;
}

export class ActivityRelocatedEvent extends DomainEvent<GroupID, ActivityRelocatedEventPayload> {
  constructor(groupId: GroupID, adminId: PersonID, activity: Activity) {
    super(groupId, {
      groupId: groupId.toString(),
      adminId: adminId.toString(),
      activity: {
        id: activity.id.toString(),
        location: activity.location.props,
      },
    });
  }
}
