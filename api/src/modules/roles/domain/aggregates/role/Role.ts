import { AggregateRoot } from '@core/domain/AggregateRoot';
import { Name } from '@core/domain/valueObjects/Name';

import { AllowedUser } from './AllowedUser';
import { CommunityID } from './CommunityID';
import { Permission } from './Permission';
import { RoleID } from './RoleID';

export interface RoleProps {
  communityId: CommunityID;
  name: Name;
  permissions: Permission[];
  allowList: AllowedUser[];
}

export class Role extends AggregateRoot<RoleProps, RoleID> {
  private constructor(props: RoleProps, id: RoleID) {
    super(props, id);
  }

  get allowList(): AllowedUser[] {
    return this.props.allowList;
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

  get permissions(): Permission[] {
    return this.props.permissions;
  }

  static create(props: RoleProps, id?: RoleID): Role {
    const role = new Role(
      {
        ...props,
        permissions: [...new Set(props.permissions)],
      },
      id ?? new RoleID(),
    );
    return role;
  }

  addPermission(permission: Permission): void {
    const newPermissions = [...new Set([...this.permissions, permission])];
    this.props.permissions = newPermissions;
  }

  removePermission(permission: Permission): void {
    const index = this.permissions.indexOf(permission);
    if (index >= 0) this.props.permissions.splice(index, 1);
  }

  addAllowedUser(allowedUser: AllowedUser): void {
    const existent = this.allowList.find((user) => user.equals(allowedUser));
    if (!existent) this.props.allowList = [...new Set([...this.allowList, allowedUser])];
  }
}
