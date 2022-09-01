import { MemoryRepository } from '@core/infrastructure/repositories/MemoryRepository';

import { GroupAggregate } from '../../domain/aggregates/group/GroupAggregate';
import { GroupRepository } from '../../domain/repositories/GroupRepository';

export class MemoryGroupRepository
  extends MemoryRepository<GroupAggregate>
  implements GroupRepository {}
