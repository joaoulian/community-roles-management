import { PersonID } from '@group/domain/aggregates/group/PersonID';
import { MemoryGroupRepository } from '@group/infrastructure/repositories/MemoryGroupRepository';
import {
  mockAdmin,
  mockGroup,
  mockMember,
} from '@group/domain/aggregates/group/tests/mocks/GroupAggregateMocks';
import { GroupAdminActor } from '@group/application/actors/GroupAdmin';

import { DismissGroupAdminUseCase } from '../DismissGroupAdmin';
import { GroupNotFoundError, UserMustBeGroupAdminError } from '../errors';

describe('Dismiss group admin use case', () => {
  it('should dismiss group admin', async () => {
    const groupRepository = new MemoryGroupRepository();
    const dismissGroupAdminUseCase = new DismissGroupAdminUseCase(groupRepository);
    const admin = mockAdmin();
    const adminToDismiss = mockAdmin();
    const adminActor = new GroupAdminActor({}, admin.personId);
    const group = mockGroup({ admins: [admin, adminToDismiss] });
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      personId: adminToDismiss.personId.toString(),
    };

    await dismissGroupAdminUseCase.execute(adminActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.hasAdmin(adminToDismiss.personId)).toBeFalsy();
  });

  it('should return error if actor is not admin of the group', async () => {
    const groupRepository = new MemoryGroupRepository();
    const dismissGroupAdminUseCase = new DismissGroupAdminUseCase(groupRepository);
    const admin = mockAdmin();
    const adminToDismiss = mockAdmin();
    const adminActor = new GroupAdminActor({}, new PersonID());
    const group = mockGroup({ admins: [admin, adminToDismiss] });
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      personId: adminToDismiss.personId.toString(),
    };

    const response = await dismissGroupAdminUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(UserMustBeGroupAdminError);
  });

  it('should return error if group is not found', async () => {
    const groupRepository = new MemoryGroupRepository();
    const dismissGroupAdminUseCase = new DismissGroupAdminUseCase(groupRepository);
    const admin = mockAdmin();
    const adminToDismiss = mockAdmin();
    const adminActor = new GroupAdminActor({}, admin.personId);
    const group = mockGroup({ admins: [admin, adminToDismiss] });
    const request = {
      groupId: group.id.toString(),
      personId: adminToDismiss.personId.toString(),
    };

    const response = await dismissGroupAdminUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });
});
