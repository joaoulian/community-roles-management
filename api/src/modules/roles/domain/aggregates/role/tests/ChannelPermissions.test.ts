import { ChannelID } from '../ChannelID';
import { ChannelPermissions } from '../ChannelPermissions';
import { ChannelPermission } from '../Permission';
import { PermissionsType } from '../Permissions';

describe('ChannelPermissions', () => {
  describe('create', () => {
    test('should create channel permissions successfully', () => {
      const args = {
        channelId: new ChannelID(),
        communityId: undefined,
        permissions: [ChannelPermission.Administrator, ChannelPermission.ManageChannels],
      };

      const channelPermissions = ChannelPermissions.create(args);

      expect(channelPermissions).toBeInstanceOf(ChannelPermissions);
      expect(channelPermissions.type).toEqual(PermissionsType.Channel);
      expect(channelPermissions.communityId).toBeUndefined();
      expect(channelPermissions.channelId).toEqual(args.channelId);
      expect(channelPermissions.permissions[0]).toEqual(args.permissions[0]);
      expect(channelPermissions.permissions[1]).toEqual(args.permissions[1]);
    });

    test('should ignore duplicated permissions', () => {
      const args = {
        channelId: new ChannelID(),
        communityId: undefined,
        permissions: [
          ChannelPermission.Administrator,
          ChannelPermission.ManageChannels,
          ChannelPermission.Administrator,
        ],
      };

      const channelPermissions = ChannelPermissions.create(args);

      expect(channelPermissions.permissions).toHaveLength(2);
      expect(channelPermissions.permissions[0]).toEqual(ChannelPermission.Administrator);
      expect(channelPermissions.permissions[1]).toEqual(ChannelPermission.ManageChannels);
    });
  });
});
