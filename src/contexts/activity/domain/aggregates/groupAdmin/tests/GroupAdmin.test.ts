import { PersonID } from '../../PersonID';
import { GroupAdmin, GroupAdminStatus } from '../GroupAdmin';

import { mockGroupAdmin } from './mocks/GroupAdmin.mock';

describe('GroupAdmin', () => {
  describe('create', () => {
    test('should create a group admin', () => {
      const groupAdmin = mockGroupAdmin();
      expect(groupAdmin).toBeInstanceOf(GroupAdmin);
      expect(groupAdmin.id).toBeInstanceOf(PersonID);
    });
  });

  describe('inactivate', () => {
    test('should inactivate a group admin', () => {
      const groupAdmin = mockGroupAdmin();
      groupAdmin.inactivate();
      expect(groupAdmin.props.status).toBe(GroupAdminStatus.Inactive);
    });
  });
});
