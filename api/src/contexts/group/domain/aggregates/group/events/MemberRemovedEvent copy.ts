import { DomainEvent } from '@core/domain/DomainEvent';

import { GroupID } from '../GroupID';
import { PersonID } from '../PersonID';

export interface MemberLeftEventPayload {
  groupId: string;
  personId: string;
}

export class MemberLeftEvent extends DomainEvent<GroupID, MemberLeftEventPayload> {
  constructor(groupId: GroupID, personId: PersonID) {
    super(groupId, { groupId: groupId.toString(), personId: personId.toString() });
  }
}
