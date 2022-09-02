import { Actor } from '@core/application/Actor';
import { MemberID } from '@roles/domain/aggregates/role/MemberID';

export class MemberActor extends Actor<MemberID> {}
