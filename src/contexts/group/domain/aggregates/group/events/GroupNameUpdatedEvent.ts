import { DomainEvent } from '@core/domain/DomainEvent';

import { GroupID } from '../GroupID';
import { GroupName } from '../GroupName';

export interface GroupNameUpdatedEventPayload {
  groupId: string;
  name: string;
}

export class GroupNameUpdatedEvent extends DomainEvent<GroupID, GroupNameUpdatedEventPayload> {
  constructor(groupId: GroupID, name: GroupName) {
    super(groupId, { groupId: groupId.toString(), name: name.value });
  }
}
