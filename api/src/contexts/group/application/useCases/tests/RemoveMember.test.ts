import { PersonID } from '@group/domain/aggregates/group/PersonID';
import { MemoryGroupRepository } from '@group/infrastructure/repositories/MemoryGroupRepository';
import {
  mockAdmin,
  mockGroup,
  mockMember,
} from '@group/domain/aggregates/group/tests/mocks/GroupAggregateMocks';
import { GroupAdminActor } from '@group/application/actors/GroupAdmin';

import { RemoveMemberUseCase } from '../RemoveMember';
import { GroupNotFoundError, UserMustBeGroupAdminError } from '../errors';

describe('Remove member use case', () => {
  it('should remove member', async () => {
    const groupRepository = new MemoryGroupRepository();
    const removeMemberUseCase = new RemoveMemberUseCase(groupRepository);
    const admin = mockAdmin();
    const member = mockMember();
    const adminActor = new GroupAdminActor({}, admin.personId);
    const group = mockGroup({ admins: [admin], members: [member] });
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      personId: member.personId.toString(),
    };

    await removeMemberUseCase.execute(adminActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.hasMember(member.personId)).toBeFalsy();
  });

  it('should return error if actor is not admin of the group', async () => {
    const groupRepository = new MemoryGroupRepository();
    const removeMemberUseCase = new RemoveMemberUseCase(groupRepository);
    const admin = mockAdmin();
    const member = mockMember();
    const adminActor = new GroupAdminActor({}, new PersonID());
    const group = mockGroup({ admins: [admin], members: [member] });
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      personId: member.personId.toString(),
    };

    const response = await removeMemberUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(UserMustBeGroupAdminError);
  });

  it('should return error if group is not found', async () => {
    const groupRepository = new MemoryGroupRepository();
    const removeMemberUseCase = new RemoveMemberUseCase(groupRepository);
    const admin = mockAdmin();
    const member = mockMember();
    const adminActor = new GroupAdminActor({}, admin.personId);
    const group = mockGroup({ admins: [admin], members: [member] });
    const request = {
      groupId: group.id.toString(),
      personId: member.personId.toString(),
    };

    const response = await removeMemberUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });
});
