import { DomainEvent } from '@core/domain/DomainEvent';

import { GroupID } from '../GroupID';
import { PersonID } from '../PersonID';

export interface MemberAddedEventPayload {
  groupId: string;
  personId: string;
}

export class MemberAddedEvent extends DomainEvent<GroupID, MemberAddedEventPayload> {
  constructor(groupId: GroupID, personId: PersonID) {
    super(groupId, { groupId: groupId.toString(), personId: personId.toString() });
  }
}
