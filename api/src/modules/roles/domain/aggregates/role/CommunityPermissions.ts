import { CommunityID } from './CommunityID';
import { CommunityPermission } from './Permission';
import { Permissions, PermissionsProps, PermissionsType } from './Permissions';

export interface CommunityPermissionsProps extends PermissionsProps {
  list: CommunityPermission[];
  channelId: undefined;
  communityId: CommunityID;
}

export class CommunityPermissions extends Permissions<CommunityPermissionsProps> {
  type = PermissionsType.Community;

  private constructor(props: CommunityPermissionsProps) {
    super(props);
  }

  get list(): CommunityPermission[] {
    return this.props.list;
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
      list: [...new Set(props.list)],
    });

    return permissions;
  }
}
