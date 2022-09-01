import { GroupID } from '@activity/domain/aggregates/GroupID';

import { Activity } from '../../Activity';
import { GroupActivities } from '../../GroupActivities';

export const mockGroupActivities = (activities?: Activity[], groupId?: GroupID) => {
  const groupActivities = GroupActivities.create(activities ?? [], groupId ?? new GroupID());
  return groupActivities;
};
