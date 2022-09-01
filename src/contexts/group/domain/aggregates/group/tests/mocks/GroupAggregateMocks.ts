import { GroupAdmin } from '../../GroupAdmin';
import { GroupAggregate, GroupProps } from '../../GroupAggregate';
import { GroupDescription } from '../../GroupDescription';
import { GroupID } from '../../GroupID';
import { GroupName } from '../../GroupName';
import { Member } from '../../Member';
import { PersonID } from '../../PersonID';

export const mockGroupName = () => GroupName.create('Group Name');

export const mockGroupDescription = () => GroupDescription.create('Group description');

export const mockMember = () =>
  Member.create({
    personId: new PersonID(),
    deleted: false,
  });

export const mockAdmin = () =>
  GroupAdmin.create({
    personId: new PersonID(),
    deleted: false,
  });

export const mockGroup = (props: Partial<GroupProps> = {}) =>
  new GroupAggregate(
    {
      name: mockGroupName(),
      description: mockGroupDescription(),
      members: [mockMember()],
      admins: [mockAdmin()],
      ...props,
    },
    new GroupID(),
  );
