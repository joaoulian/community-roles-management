import { PersonID } from '@group/domain/aggregates/group/PersonID';
import { MemoryGroupRepository } from '@group/infrastructure/repositories/MemoryGroupRepository';
import {
  mockAdmin,
  mockGroup,
} from '@group/domain/aggregates/group/tests/mocks/GroupAggregateMocks';
import { Member } from '@group/domain/aggregates/group/Member';
import { GroupAdminActor } from '@group/application/actors/GroupAdmin';

import { EditGroupUseCase } from '../EditGroup';
import { GroupNotFoundError, UserMustBeGroupAdminError } from '../errors';

describe('Edit group use case', () => {
  it('should edit the group', async () => {
    const groupRepository = new MemoryGroupRepository();
    const editGroupUseCase = new EditGroupUseCase(groupRepository);
    const admin = mockAdmin();
    const adminActor = new GroupAdminActor({}, admin.personId);
    const group = mockGroup({ admins: [admin] });
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      name: 'new name',
      description: 'new description',
    };

    await editGroupUseCase.execute(adminActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.name.value).toEqual(request.name);
    expect(storedGroup!.description.value).toEqual(request.description);
  });

  it('should return error id actor is not admin of the group', async () => {
    const groupRepository = new MemoryGroupRepository();
    const editGroupUseCase = new EditGroupUseCase(groupRepository);
    const admin = mockAdmin();
    const actor = new GroupAdminActor({}, new PersonID());
    const group = mockGroup({ admins: [admin] });
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      name: 'new name',
      description: 'new description',
    };

    const response = await editGroupUseCase.execute(actor, request);

    expect(response.value).toBeInstanceOf(UserMustBeGroupAdminError);
  });

  it('should return error if group is not found', async () => {
    const groupRepository = new MemoryGroupRepository();
    const editGroupUseCase = new EditGroupUseCase(groupRepository);
    const actor = new GroupAdminActor({}, new PersonID());
    const group = mockGroup();
    const request = { groupId: group.id.toString() };

    const response = await editGroupUseCase.execute(actor, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });
});
