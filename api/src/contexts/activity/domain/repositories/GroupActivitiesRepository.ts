import { Repository } from '@core/domain/Repository';

import { GroupActivities } from '../aggregates/groupActivities/GroupActivities';

export interface GroupActivitiesRepository extends Repository<GroupActivities> {}
