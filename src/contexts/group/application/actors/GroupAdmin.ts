import { Actor } from '@core/application/Actor';

import { PersonID } from '../../domain/aggregates/group/PersonID';

export class GroupAdminActor extends Actor<PersonID> {}
