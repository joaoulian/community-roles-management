import { ChannelID } from '../ChannelID';
import { CommunityID } from '../CommunityID';
import { CommunityPermissions } from '../CommunityPermissions';
import { CommunityPermission } from '../Permission';
import { PermissionsType } from '../Permissions';

describe('CommunityPermissions', () => {
  describe('create', () => {
    test('should create community permissions successfully', () => {
      const args = {
        channelId: undefined,
        communityId: new CommunityID(),
        list: [CommunityPermission.Administrator, CommunityPermission.ManageChannels],
      };

      const communityPermissions = CommunityPermissions.create(args);

      expect(communityPermissions).toBeInstanceOf(CommunityPermissions);
      expect(communityPermissions.type).toEqual(PermissionsType.Community);
      expect(communityPermissions.channelId).toBeUndefined();
      expect(communityPermissions.communityId).toEqual(args.communityId);
      expect(communityPermissions.list[0]).toEqual(args.list[0]);
      expect(communityPermissions.list[1]).toEqual(args.list[1]);
    });

    test('should ignore duplicated permissions', () => {
      const args = {
        channelId: undefined,
        communityId: new CommunityID(),
        list: [
          CommunityPermission.Administrator,
          CommunityPermission.ManageChannels,
          CommunityPermission.Administrator,
        ],
      };

      const communityPermissions = CommunityPermissions.create(args);

      expect(communityPermissions.list).toHaveLength(2);
      expect(communityPermissions.list[0]).toEqual(CommunityPermission.Administrator);
      expect(communityPermissions.list[1]).toEqual(CommunityPermission.ManageChannels);
    });
  });
});
