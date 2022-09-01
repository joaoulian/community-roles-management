import { PersonID } from '@group/domain/aggregates/group/PersonID';
import { MemoryGroupRepository } from '@group/infrastructure/repositories/MemoryGroupRepository';
import { mockGroup } from '@group/domain/aggregates/group/tests/mocks/GroupAggregateMocks';

import { PersonActor } from '../../actors/Person';
import { RequestToJoinGroupUseCase } from '../RequestToJoinGroup';
import { GroupNotFoundError } from '../errors';

describe('Request to join group use case', () => {
  it('should join the group', async () => {
    const groupRepository = new MemoryGroupRepository();
    const requestToJoinGroupUseCase = new RequestToJoinGroupUseCase(groupRepository);
    const person = new PersonActor({}, new PersonID());
    const group = mockGroup();
    groupRepository.save(group);
    const request = { groupId: group.id.toString() };

    await requestToJoinGroupUseCase.execute(person, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.members.map((member) => member.personId)).toContain(person.id);
  });

  it('should return error if group is not found', async () => {
    const groupRepository = new MemoryGroupRepository();
    const requestToJoinGroupUseCase = new RequestToJoinGroupUseCase(groupRepository);
    const person = new PersonActor({}, new PersonID());
    const group = mockGroup();
    const request = { groupId: group.id.toString() };

    const response = await requestToJoinGroupUseCase.execute(person, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });
});
