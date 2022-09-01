import { AggregateRoot } from '@core/domain/AggregateRoot';

import { PersonID } from '../PersonID';
import { GroupID } from '../GroupID';

export enum MemberStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export interface MemberAggregateProps {
  groupId: GroupID;
  status: MemberStatus;
}

export class Member extends AggregateRoot<MemberAggregateProps, PersonID> {
  private constructor(props: MemberAggregateProps, id: PersonID) {
    super(props, id);
  }

  static create(groupId: GroupID, id: PersonID, status?: MemberStatus): Member {
    return new Member({ groupId, status: status ?? MemberStatus.Active }, id);
  }

  inactivate(): void {
    this.props.status = MemberStatus.Inactive;
  }
}
