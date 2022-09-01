import { Repository } from '@core/domain/Repository';

import { GroupAggregate } from '../aggregates/group/GroupAggregate';

export interface GroupRepository extends Repository<GroupAggregate> {}
