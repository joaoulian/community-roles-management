import { DomainEvent } from '@core/domain/DomainEvent';

import { GroupDescription } from '../GroupDescription';
import { GroupID } from '../GroupID';
import { GroupName } from '../GroupName';
import { PersonID } from '../PersonID';

export interface GroupCreatedEventPayload {
  groupId: string;
  name: string;
  description: string;
  creatorId: string;
}

export class GroupCreatedEvent extends DomainEvent<GroupID, GroupCreatedEventPayload> {
  constructor(
    groupId: GroupID,
    name: GroupName,
    description: GroupDescription,
    creatorId: PersonID,
  ) {
    super(groupId, {
      groupId: groupId.toString(),
      name: name.value,
      description: description.value,
      creatorId: creatorId.toString(),
    });
  }
}
