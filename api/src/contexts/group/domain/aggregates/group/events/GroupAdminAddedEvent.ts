import { DomainEvent } from '@core/domain/DomainEvent';

import { GroupID } from '../GroupID';
import { PersonID } from '../PersonID';

export interface GroupAdminAddedEventPayload {
  groupId: string;
  personId: string;
}

export class GroupAdminAddedEvent extends DomainEvent<GroupID, GroupAdminAddedEventPayload> {
  constructor(groupId: GroupID, personId: PersonID) {
    super(groupId, { groupId: groupId.toString(), personId: personId.toString() });
  }
}
