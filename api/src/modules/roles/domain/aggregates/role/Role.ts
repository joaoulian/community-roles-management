import { AggregateRoot } from '@core/domain/AggregateRoot';
import { Name } from '@core/domain/valueObjects/Name';

import { CommunityID } from './CommunityID';
import { Permissions } from './Permissions';
import { RoleID } from './RoleID';
import { UserID } from './UserID';

export interface RoleProps {
  communityId: CommunityID;
  name: Name;
  permissions: Permissions[];
  users: UserID[];
}

export class Role extends AggregateRoot<RoleProps, RoleID> {
  private constructor(props: RoleProps, id: RoleID) {
    super(props, id);
  }

  get name(): Name {
    return this.props.name;
  }

  set name(newName: Name) {
    this.props.name = newName;
  }

  get communityId(): CommunityID {
    return this.props.communityId;
  }

  get permissions(): Permissions[] {
    return this.props.permissions;
  }

  get users(): UserID[] {
    return this.props.users;
  }

  static create(props: RoleProps, id?: RoleID): Role {
    const role = new Role(props, id ?? new RoleID());
    return role;
  }
}
