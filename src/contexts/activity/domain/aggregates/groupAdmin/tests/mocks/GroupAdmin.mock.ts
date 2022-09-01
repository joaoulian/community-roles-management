import { GroupID } from '@activity/domain/aggregates/GroupID';
import { PersonID } from '@activity/domain/aggregates/PersonID';

import { GroupAdmin } from '../../GroupAdmin';

export const mockGroupAdmin = (groupId?: GroupID, personId?: PersonID) => {
  return GroupAdmin.create(groupId ?? new GroupID(), personId ?? new PersonID());
};
