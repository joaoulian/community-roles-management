import { CommunityID } from './CommunityID';
import { CommunityPermission } from './Permission';
import { Permissions, PermissionsProps, PermissionsType } from './Permissions';

export interface CommunityPermissionsProps extends PermissionsProps {
  permissions: CommunityPermission[];
  channelId: undefined;
  communityId: CommunityID;
}

export class CommunityPermissions extends Permissions<CommunityPermissionsProps> {
  type = PermissionsType.Community;

  private constructor(props: CommunityPermissionsProps) {
    super(props);
  }

  get permissions(): CommunityPermission[] {
    return this.props.permissions;
  }

  get communityId(): CommunityID {
    return this.props.communityId;
  }

  get channelId(): undefined {
    return undefined;
  }

  static create(props: CommunityPermissionsProps): CommunityPermissions {
    const permissions = new CommunityPermissions({
      ...props,
      permissions: [...new Set(props.permissions)],
    });

    return permissions;
  }
}
