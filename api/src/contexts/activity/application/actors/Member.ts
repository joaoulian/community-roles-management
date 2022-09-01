import { GroupID } from '@activity/domain/aggregates/GroupID';
import { PersonID } from '@activity/domain/aggregates/PersonID';
import { Actor } from '@core/application/Actor';

interface MemberActorProps {
  groupId: GroupID;
}

export class MemberActor extends Actor<PersonID, MemberActorProps> {}
