import { AggregateRoot } from '@core/domain/AggregateRoot';

import { PersonID } from '../PersonID';
import { GroupID } from '../GroupID';

export enum GroupAdminStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export interface GroupAdminAggregateProps {
  groupId: GroupID;
  status: GroupAdminStatus;
}

export class GroupAdmin extends AggregateRoot<GroupAdminAggregateProps, PersonID> {
  private constructor(props: GroupAdminAggregateProps, id: PersonID) {
    super(props, id);
  }

  static create(groupId: GroupID, id: PersonID, status?: GroupAdminStatus): GroupAdmin {
    return new GroupAdmin({ groupId, status: status ?? GroupAdminStatus.Active }, id);
  }

  inactivate(): void {
    this.props.status = GroupAdminStatus.Inactive;
  }
}
