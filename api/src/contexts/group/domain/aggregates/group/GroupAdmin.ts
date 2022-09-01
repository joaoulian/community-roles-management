import { ValueObject } from '@core/domain/ValueObject';

import { PersonID } from './PersonID';

interface GroupAdminProps {
  personId: PersonID;
  deleted: boolean;
}

export class GroupAdmin extends ValueObject<GroupAdminProps> {
  static create(props: GroupAdminProps): GroupAdmin {
    return new GroupAdmin(props);
  }

  private constructor(props: GroupAdminProps) {
    super(props);
  }

  get personId(): PersonID {
    return this.props.personId;
  }

  get deleted(): boolean {
    return this.props.deleted;
  }

  withDeleted(): GroupAdmin {
    return GroupAdmin.create({ ...this.props, deleted: true });
  }
}
