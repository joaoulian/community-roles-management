import { PersonID } from '@group/domain/aggregates/group/PersonID';
import { MemoryGroupRepository } from '@group/infrastructure/repositories/MemoryGroupRepository';
import { mockGroup } from '@group/domain/aggregates/group/tests/mocks/GroupAggregateMocks';
import { Member } from '@group/domain/aggregates/group/Member';

import { MemberActor } from '../../actors/Member';
import { LeaveGroupUseCase } from '../LeaveGroup';
import { GroupNotFoundError } from '../errors';

describe('Leave group use case', () => {
  it('should leave the group', async () => {
    const groupRepository = new MemoryGroupRepository();
    const leaveGroupUseCase = new LeaveGroupUseCase(groupRepository);
    const memberActor = new MemberActor({}, new PersonID());
    const member = Member.create({ personId: memberActor.id, deleted: false });
    const group = mockGroup({ members: [member] });
    groupRepository.save(group);
    const request = { groupId: group.id.toString() };

    await leaveGroupUseCase.execute(memberActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.members.map((member) => member.personId)).not.toContain(memberActor.id);
  });

  it('should return error if group is not found', async () => {
    const groupRepository = new MemoryGroupRepository();
    const leaveGroupUseCase = new LeaveGroupUseCase(groupRepository);
    const person = new MemberActor({}, new PersonID());
    const group = mockGroup();
    const request = { groupId: group.id.toString() };

    const response = await leaveGroupUseCase.execute(person, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });
});
