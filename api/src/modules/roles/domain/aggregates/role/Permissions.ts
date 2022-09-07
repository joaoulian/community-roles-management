import { ValueObject } from '@core/domain/ValueObject';

import { ChannelID } from './ChannelID';
import { CommunityID } from './CommunityID';
import { CommunityPermission, ChannelPermission } from './Permission';

export abstract class Permissions<
  T extends PermissionsProps = PermissionsProps,
> extends ValueObject<T> {
  abstract type: PermissionsType;

  get permissions(): (CommunityPermission | ChannelPermission)[] {
    return this.props.permissions;
  }

  get communityId(): CommunityID | undefined {
    return this.props.communityId;
  }

  get channelId(): ChannelID | undefined {
    return this.props.channelId;
  }

  protected constructor(props: T) {
    super(props);
  }
}

export interface PermissionsProps {
  permissions: (CommunityPermission | ChannelPermission)[];
  communityId?: CommunityID;
  channelId?: ChannelID;
}

export enum PermissionsType {
  Channel = 'channel',
  Community = 'community',
}
