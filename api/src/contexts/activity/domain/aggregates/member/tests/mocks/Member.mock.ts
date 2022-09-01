import { GroupID } from '@activity/domain/aggregates/GroupID';
import { PersonID } from '@activity/domain/aggregates/PersonID';

import { Member } from '../../Member';

export const mockMember = (groupId?: GroupID) => {
  return Member.create(groupId ?? new GroupID(), new PersonID());
};
