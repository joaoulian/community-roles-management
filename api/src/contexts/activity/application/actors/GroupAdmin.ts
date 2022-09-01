import { GroupID } from '@activity/domain/aggregates/GroupID';
import { PersonID } from '@activity/domain/aggregates/PersonID';
import { Actor } from '@core/application/Actor';

interface GroupAdminActorProps {
  groupId: GroupID;
}

export class GroupAdminActor extends Actor<PersonID, GroupAdminActorProps> {}
