import { GroupActivities } from '@activity/domain/aggregates/groupActivities/GroupActivities';
import { GroupActivitiesRepository } from '@activity/domain/repositories/GroupActivitiesRepository';
import { MemoryRepository } from '@core/infrastructure/repositories/MemoryRepository';

export class MemoryGroupActivitiesRepository
  extends MemoryRepository<GroupActivities>
  implements GroupActivitiesRepository {}
