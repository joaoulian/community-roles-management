import { DomainEvent } from '@core/domain/DomainEvent';

import { GroupID } from '../GroupID';
import { PersonID } from '../PersonID';

export interface GroupAdminDismissedEventPayload {
  groupId: string;
  personId: string;
}

export class GroupAdminDismissedEvent extends DomainEvent<
  GroupID,
  GroupAdminDismissedEventPayload
> {
  constructor(groupId: GroupID, personId: PersonID) {
    super(groupId, { groupId: groupId.toString(), personId: personId.toString() });
  }
}
