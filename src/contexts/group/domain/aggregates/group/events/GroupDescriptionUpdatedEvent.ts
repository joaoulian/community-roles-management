import { DomainEvent } from '@core/domain/DomainEvent';

import { GroupDescription } from '../GroupDescription';
import { GroupID } from '../GroupID';

export interface GroupDescriptionUpdatedEventPayload {
  groupId: string;
  description: string;
}

export class GroupDescriptionUpdatedEvent extends DomainEvent<
  GroupID,
  GroupDescriptionUpdatedEventPayload
> {
  constructor(groupId: GroupID, description: GroupDescription) {
    super(groupId, { groupId: groupId.toString(), description: description.value });
  }
}
