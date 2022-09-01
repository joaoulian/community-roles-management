import { GroupAdminAddedEvent } from '../events/GroupAdminAddedEvent';
import { GroupAdminDismissedEvent } from '../events/GroupAdminDismissedEvent';
import { GroupCreatedEvent } from '../events/GroupCreatedEvent';
import { GroupDescriptionUpdatedEvent } from '../events/GroupDescriptionUpdatedEvent';
import { GroupNameUpdatedEvent } from '../events/GroupNameUpdatedEvent';
import { MemberAddedEvent } from '../events/MemberAddedEvent';
import { MemberRemovedEvent } from '../events/MemberRemovedEvent';
import { MemberLeftEvent } from '../events/MemberRemovedEvent copy';
import { GroupAdminMustBeMemberException, GroupAggregate } from '../GroupAggregate';
import { GroupDescription } from '../GroupDescription';
import { GroupID } from '../GroupID';
import { GroupName } from '../GroupName';
import { PersonID } from '../PersonID';

import {
  mockAdmin,
  mockGroupDescription,
  mockGroupName,
  mockMember,
} from './mocks/GroupAggregateMocks';

describe('GroupAggregate', () => {
  describe('create', () => {
    const name = mockGroupName();
    const description = mockGroupDescription();
    const creatorId = new PersonID();
    it('should create a group', () => {
      expect(GroupAggregate.create(name, description, creatorId)).toBeInstanceOf(GroupAggregate);
    });

    it('should have the creator as member', () => {
      const group = GroupAggregate.create(name, description, creatorId);

      expect(group.members.length).toBe(1);
      expect(group.members.map((member) => member.personId).includes(creatorId)).toBe(true);
    });

    it('should have the creator as admin', () => {
      const group = GroupAggregate.create(name, description, creatorId);

      expect(group.admins.length).toBe(1);
      expect(group.admins.map((member) => member.personId).includes(creatorId)).toBe(true);
    });

    it('should add the domain event', () => {
      const group = GroupAggregate.create(name, description, creatorId);

      expect(group.domainEvents.length).toBe(1);
      expect(group.domainEvents[0]).toBeInstanceOf(GroupCreatedEvent);
    });
  });

  describe('update name', () => {
    const props = {
      name: mockGroupName(),
      description: mockGroupDescription(),
      members: [mockMember()],
      admins: [mockAdmin()],
    };

    it('should update the group name', () => {
      const group = new GroupAggregate(props, new GroupID());
      const editedName = GroupName.create('Edited name');

      group.name = editedName;

      expect(group.name).toBe(editedName);
    });

    it('should add the domain event', () => {
      const group = new GroupAggregate(props, new GroupID());
      const editedName = GroupName.create('Edited name');

      group.name = editedName;

      expect(group.domainEvents.length).toBe(1);
      expect(group.domainEvents[0]).toBeInstanceOf(GroupNameUpdatedEvent);
    });
  });

  describe('update description', () => {
    const props = {
      name: mockGroupName(),
      description: mockGroupDescription(),
      members: [mockMember()],
      admins: [mockAdmin()],
    };

    it('should update the group description', () => {
      const group = new GroupAggregate(props, new GroupID());
      const editedDescription = GroupDescription.create('Edited description');

      group.description = editedDescription;

      expect(group.description).toBe(editedDescription);
    });

    it('should add the domain event', () => {
      const group = new GroupAggregate(props, new GroupID());
      const editedDescription = GroupDescription.create('Edited description');

      group.description = editedDescription;

      expect(group.domainEvents.length).toBe(1);
      expect(group.domainEvents[0]).toBeInstanceOf(GroupDescriptionUpdatedEvent);
    });
  });

  describe('add admin', () => {
    it('should not add group admin if it is not a member', () => {
      const member = mockMember();
      const group = new GroupAggregate(
        {
          name: mockGroupName(),
          description: mockGroupDescription(),
          members: [member],
          admins: [],
        },
        new GroupID(),
      );

      expect(() => group.addAdmin(new PersonID())).toThrowError(GroupAdminMustBeMemberException);
      expect(group.domainEvents.length).toBe(0);
    });

    it('should add group admin when it is a member', () => {
      const member = mockMember();
      const group = new GroupAggregate(
        {
          name: mockGroupName(),
          description: mockGroupDescription(),
          members: [member],
          admins: [],
        },
        new GroupID(),
      );

      group.addAdmin(member.personId);

      expect(group.admins[0].personId.equals(member.personId)).toBeTruthy();
      expect(group.domainEvents.length).toBe(1);
      expect(group.domainEvents[0]).toBeInstanceOf(GroupAdminAddedEvent);
    });
  });

  describe('dismiss admin', () => {
    it('should dismiss group admin', () => {
      const admin = mockAdmin();
      const group = new GroupAggregate(
        {
          name: mockGroupName(),
          description: mockGroupDescription(),
          members: [],
          admins: [admin],
        },
        new GroupID(),
      );

      group.dismissAdmin(admin.personId);

      expect(group.admins.length).toBe(0);
      expect(group.props.admins[0].equals(admin.withDeleted())).toBeTruthy();
      expect(group.domainEvents.length).toBe(1);
      expect(group.domainEvents[0]).toBeInstanceOf(GroupAdminDismissedEvent);
    });
  });

  describe('add member', () => {
    it('should not add domain event if person is already member', () => {
      const member = mockMember();
      const group = new GroupAggregate(
        {
          name: mockGroupName(),
          description: mockGroupDescription(),
          members: [member],
          admins: [],
        },
        new GroupID(),
      );

      group.addMember(member.personId);

      expect(group.members.length).toBe(1);
      expect(group.members[0]).toEqual(member);
      expect(group.domainEvents.length).toBe(0);
    });

    it('should add member', () => {
      const personId = new PersonID();
      const group = new GroupAggregate(
        {
          name: mockGroupName(),
          description: mockGroupDescription(),
          members: [],
          admins: [],
        },
        new GroupID(),
      );

      group.addMember(personId);

      expect(group.members[0].personId.equals(personId)).toBeTruthy();
      expect(group.domainEvents.length).toBe(1);
      expect(group.domainEvents[0]).toBeInstanceOf(MemberAddedEvent);
    });
  });

  describe('remove member', () => {
    it('should not add domain event if person was not a member', () => {
      const group = new GroupAggregate(
        {
          name: mockGroupName(),
          description: mockGroupDescription(),
          members: [],
          admins: [],
        },
        new GroupID(),
      );

      group.removeMember(new PersonID());

      expect(group.members.length).toBe(0);
      expect(group.domainEvents.length).toBe(0);
    });

    it('should remove member', () => {
      const member = mockMember();
      const group = new GroupAggregate(
        {
          name: mockGroupName(),
          description: mockGroupDescription(),
          members: [member],
          admins: [],
        },
        new GroupID(),
      );

      group.removeMember(member.personId);

      expect(group.members.length).toBe(0);
      expect(group.domainEvents.length).toBe(1);
      expect(group.domainEvents[0]).toBeInstanceOf(MemberRemovedEvent);
    });
  });

  describe('leave member', () => {
    it('should not add domain event if person was not a member', () => {
      const group = new GroupAggregate(
        {
          name: mockGroupName(),
          description: mockGroupDescription(),
          members: [],
          admins: [],
        },
        new GroupID(),
      );

      group.leaveMember(new PersonID());

      expect(group.members.length).toBe(0);
      expect(group.domainEvents.length).toBe(0);
    });

    it('should leave member', () => {
      const member = mockMember();
      const group = new GroupAggregate(
        {
          name: mockGroupName(),
          description: mockGroupDescription(),
          members: [member],
          admins: [],
        },
        new GroupID(),
      );

      group.leaveMember(member.personId);

      expect(group.members.length).toBe(0);
      expect(group.domainEvents.length).toBe(1);
      expect(group.domainEvents[0]).toBeInstanceOf(MemberLeftEvent);
    });
  });
});
