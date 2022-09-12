import { ChannelID } from './ChannelID';
import { CommunityID } from './CommunityID';
import { ChannelPermission } from './Permission';
import { Permissions, PermissionsProps, PermissionsType } from './Permissions';

export interface ChannelPermissionsProps extends PermissionsProps {
  list: ChannelPermission[];
  channelId: ChannelID;
  communityId: undefined;
}

export class ChannelPermissions extends Permissions<ChannelPermissionsProps> {
  type = PermissionsType.Channel;

  private constructor(props: ChannelPermissionsProps) {
    super(props);
  }

  get list(): ChannelPermission[] {
    return this.props.list;
  }

  get communityId(): undefined {
    return undefined;
  }

  get channelId(): ChannelID {
    return this.props.channelId;
  }

  static create(props: ChannelPermissionsProps): ChannelPermissions {
    const permissions = new ChannelPermissions({
      ...props,
      list: [...new Set(props.list)],
    });
    return permissions;
  }
}
