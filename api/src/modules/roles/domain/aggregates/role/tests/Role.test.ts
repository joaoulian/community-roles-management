import { Name } from '@core/domain/valueObjects/Name';

import { CommunityID } from '../CommunityID';
import { Role } from '../Role';
import { RoleID } from '../RoleID';

import { mockCommunityPermissions } from './mocks/Permissions.mock';

describe('Role', () => {
  describe('create', () => {
    test('should create role successfully', () => {
      const communityId = new CommunityID();
      const name = Name.create('role name');
      const permissions = [mockCommunityPermissions()];

      const role = Role.create({
        communityId,
        name,
        permissions,
        users: [],
      });

      expect(role).toBeInstanceOf(Role);
      expect(role.id).toBeInstanceOf(RoleID);
      expect(role.permissions).toHaveLength(1);
      expect(role.permissions[0].equals(permissions[0])).toBeTruthy();
      expect(role.name.equals(name)).toBeTruthy();
      expect(role.communityId.equals(communityId)).toBeTruthy();
    });
  });
});
