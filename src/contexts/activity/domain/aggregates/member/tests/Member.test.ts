import { PersonID } from '../../PersonID';
import { Member, MemberStatus } from '../Member';

import { mockMember } from './mocks/Member.mock';

describe('Member', () => {
  describe('create', () => {
    test('should create a group admin', () => {
      const groupAdmin = mockMember();
      expect(groupAdmin).toBeInstanceOf(Member);
      expect(groupAdmin.id).toBeInstanceOf(PersonID);
    });
  });

  describe('inactivate', () => {
    test('should inactivate a group admin', () => {
      const groupAdmin = mockMember();
      groupAdmin.inactivate();
      expect(groupAdmin.props.status).toBe(MemberStatus.Inactive);
    });
  });
});
