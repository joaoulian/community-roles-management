import { PersonID } from '@group/domain/aggregates/group/PersonID';
import { MemoryGroupRepository } from '@group/infrastructure/repositories/MemoryGroupRepository';
import {
  mockAdmin,
  mockGroup,
  mockMember,
} from '@group/domain/aggregates/group/tests/mocks/GroupAggregateMocks';
import { GroupAdminActor } from '@group/application/actors/GroupAdmin';

import { AddGroupAdminUseCase, PersonMustBeMemberToBecomeAdminError } from '../AddGroupAdmin';
import { GroupNotFoundError, UserMustBeGroupAdminError } from '../errors';

describe('Add group admin use case', () => {
  it('should add group admin', async () => {
    const groupRepository = new MemoryGroupRepository();
    const addGroupAdminUseCase = new AddGroupAdminUseCase(groupRepository);
    const admin = mockAdmin();
    const member = mockMember();
    const adminActor = new GroupAdminActor({}, admin.personId);
    const group = mockGroup({ admins: [admin], members: [member] });
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      personId: member.personId.toString(),
    };

    await addGroupAdminUseCase.execute(adminActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.hasAdmin(member.personId)).toBeTruthy();
  });

  it('should return error if actor is not admin of the group', async () => {
    const groupRepository = new MemoryGroupRepository();
    const addGroupAdminUseCase = new AddGroupAdminUseCase(groupRepository);
    const admin = mockAdmin();
    const member = mockMember();
    const actor = new GroupAdminActor({}, new PersonID());
    const group = mockGroup({ admins: [admin], members: [member] });
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      personId: member.personId.toString(),
    };

    const response = await addGroupAdminUseCase.execute(actor, request);

    expect(response.value).toBeInstanceOf(UserMustBeGroupAdminError);
  });

  it('should return error if person is not a member of the group', async () => {
    const groupRepository = new MemoryGroupRepository();
    const addGroupAdminUseCase = new AddGroupAdminUseCase(groupRepository);
    const admin = mockAdmin();
    const member = mockMember();
    const adminActor = new GroupAdminActor({}, admin.personId);
    const group = mockGroup({ admins: [admin], members: [] });
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      personId: member.personId.toString(),
    };

    const response = await addGroupAdminUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(PersonMustBeMemberToBecomeAdminError);
  });

  it('should return error if group is not found', async () => {
    const groupRepository = new MemoryGroupRepository();
    const addGroupAdminUseCase = new AddGroupAdminUseCase(groupRepository);
    const admin = mockAdmin();
    const member = mockMember();
    const actor = new GroupAdminActor({}, new PersonID());
    const group = mockGroup({ admins: [admin], members: [member] });
    const request = {
      groupId: group.id.toString(),
      personId: member.personId.toString(),
    };

    const response = await addGroupAdminUseCase.execute(actor, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });
});
