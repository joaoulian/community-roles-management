import { ChannelID } from '../../ChannelID';
import { ChannelPermissions, ChannelPermissionsProps } from '../../ChannelPermissions';
import { CommunityID } from '../../CommunityID';
import { CommunityPermissions, CommunityPermissionsProps } from '../../CommunityPermissions';
import { CommunityPermission, ChannelPermission } from '../../Permission';

export const mockCommunityPermissions = (
  props?: Partial<CommunityPermissionsProps>,
): CommunityPermissions => {
  return CommunityPermissions.create({
    channelId: undefined,
    communityId: new CommunityID(),
    permissions: [CommunityPermission.Administrator],
    ...props,
  });
};

export const mockChannelPermissions = (
  props?: Partial<ChannelPermissionsProps>,
): ChannelPermissions => {
  return ChannelPermissions.create({
    channelId: new ChannelID(),
    communityId: undefined,
    permissions: [ChannelPermission.Administrator],
    ...props,
  });
};
