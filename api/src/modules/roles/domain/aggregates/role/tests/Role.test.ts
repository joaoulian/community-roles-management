import { Name } from '@core/domain/valueObjects/Name';

import { CommunityID } from '../CommunityID';
import { Permission } from '../Permission';
import { Role } from '../Role';
import { RoleID } from '../RoleID';

import { mockAllowedUser } from './mocks/AllowedUser.mock';
import { mockRole } from './mocks/Role.mock';

describe('Role', () => {
  describe('create', () => {
    test('should create role successfully', () => {
      const communityId = new CommunityID();
      const name = Name.create('role name');
      const permissions = [Permission.Administrator];
      const role = Role.create({
        allowList: [],
        communityId,
        name,
        permissions,
      });

      expect(role).toBeInstanceOf(Role);
      expect(role.id).toBeInstanceOf(RoleID);
      expect(role.allowList).toEqual([]);
      expect(role.permissions).toEqual([Permission.Administrator]);
      expect(role.name.equals(name)).toBeTruthy();
      expect(role.communityId.equals(communityId)).toBeTruthy();
    });

    test('should ignore duplicates in the permissions array', () => {
      const communityId = new CommunityID();
      const name = Name.create('role name');
      const permissions = [Permission.Administrator, Permission.Administrator];
      const role = Role.create({
        allowList: [],
        communityId,
        name,
        permissions,
      });

      expect(role).toBeInstanceOf(Role);
      expect(role.id).toBeInstanceOf(RoleID);
      expect(role.allowList).toEqual([]);
      expect(role.permissions).toEqual([Permission.Administrator]);
      expect(role.name.equals(name)).toBeTruthy();
      expect(role.communityId.equals(communityId)).toBeTruthy();
    });
  });

  describe('add permission', () => {
    test('should add permission successfully', () => {
      const role = mockRole({ permissions: [] });
      const newPermission = Permission.ManageChannels;

      role.addPermission(newPermission);

      expect(role.permissions).toEqual([newPermission]);
    });

    test('should ignore if permission already added', () => {
      const newPermission = Permission.ManageChannels;
      const role = mockRole({ permissions: [newPermission] });

      role.addPermission(newPermission);

      expect(role.permissions).toEqual([newPermission]);
    });
  });

  describe('remove permission', () => {
    test('should remove permission successfully', () => {
      const role = mockRole({ permissions: [Permission.ManageChannels] });
      const permissionToBeRemoved = Permission.ManageChannels;

      role.removePermission(permissionToBeRemoved);

      expect(role.permissions).toEqual([]);
    });

    test('should ignore if permission not included in the array', () => {
      const newPermission = Permission.ManageChannels;
      const role = mockRole({ permissions: [] });

      role.removePermission(newPermission);

      expect(role.permissions).toEqual([]);
    });
  });

  describe('add allowed user', () => {
    test('should add new allowed user succesfully', () => {
      const role = mockRole({ allowList: [] });
      const allowedUser = mockAllowedUser();

      role.addAllowedUser(allowedUser);

      expect(role.allowList).toEqual([allowedUser]);
    });

    test('should ignore if user already added', () => {
      const allowedUser = mockAllowedUser();
      const role = mockRole({ allowList: [allowedUser] });

      role.addAllowedUser(allowedUser);

      expect(role.allowList).toEqual([allowedUser]);
    });
  });

  describe('remove allowed user', () => {
    test('should renive allowed user succesfully', () => {
      const allowedUser = mockAllowedUser();
      const role = mockRole({ allowList: [allowedUser] });

      role.removeAllowedUser(allowedUser.username);

      expect(role.allowList).toEqual([]);
    });

    test('should ignore if user already added', () => {
      const allowedUser = mockAllowedUser();
      const role = mockRole({ allowList: [] });

      role.removeAllowedUser(allowedUser.username);

      expect(role.allowList).toEqual([]);
    });
  });

  describe('update name', () => {
    test('should update name successfully', () => {
      const newName = Name.create('new name');
      const role = mockRole({ name: Name.create('old name') });

      role.name = newName;

      expect(role.name.equals(newName)).toBeTruthy();
    });
  });

  describe('update permissions', () => {
    test('should update permissions successfully', () => {
      const permissions = [Permission.ManageChannels];
      const role = mockRole({ permissions: [Permission.Administrator] });

      role.updatePermissions(permissions);

      expect(role.permissions).toEqual(permissions);
    });
  });
});
