import { DomainEvent } from '@core/domain/DomainEvent';

import { GroupID } from '../GroupID';
import { PersonID } from '../PersonID';

export interface MemberRemovedEventPayload {
  groupId: string;
  personId: string;
}

export class MemberRemovedEvent extends DomainEvent<GroupID, MemberRemovedEventPayload> {
  constructor(groupId: GroupID, personId: PersonID) {
    super(groupId, { groupId: groupId.toString(), personId: personId.toString() });
  }
}
