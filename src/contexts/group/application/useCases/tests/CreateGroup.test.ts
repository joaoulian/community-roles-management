import { GroupID } from '@group/domain/aggregates/group/GroupID';
import { PersonID } from '@group/domain/aggregates/group/PersonID';
import { MemoryGroupRepository } from '@group/infrastructure/repositories/MemoryGroupRepository';

import { PersonActor } from '../../actors/Person';
import { CreateGroupUseCase, CreateGroupValidationError } from '../CreateGroup';

describe('Create group use case', () => {
  it('should create a group', async () => {
    const groupRepository = new MemoryGroupRepository();
    const createGroupUseCase = new CreateGroupUseCase(groupRepository);
    const person = new PersonActor({}, new PersonID());
    const request = { name: 'Group', description: 'Group description' };

    const groupOrError = await createGroupUseCase.execute(person, request);
    if (groupOrError.isFailure()) throw groupOrError.value;

    const responseId = groupOrError.value.id;
    const createdGroupId = new GroupID(responseId);

    const storedGroup = await groupRepository.getById(createdGroupId);
    expect(storedGroup!.id.equals(createdGroupId)).toBeTruthy();
    expect(storedGroup!.name.value).toBe(request.name);
    expect(storedGroup!.description.value).toBe(request.description);
  });

  it('should return error if name is invalid', async () => {
    const groupRepository = new MemoryGroupRepository();
    const createGroupUseCase = new CreateGroupUseCase(groupRepository);
    const person = new PersonActor({}, new PersonID());
    const request = { name: '', description: 'Group description' };

    const groupOrError = await createGroupUseCase.execute(person, request);

    expect(groupOrError.value).toBeInstanceOf(CreateGroupValidationError);

    const storedGroups = await groupRepository.getAll();
    expect(storedGroups.length).toEqual(0);
  });
});
