import { RoleRepositoryMemoryImpl } from '@roles/infrastructure/repositories/RoleRepositoryMemoryImpl';
import { PersonActor } from '@roles/application/actors/Person';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { RoleID } from '@roles/domain/aggregates/role/RoleID';
import { CommunityPermissions } from '@roles/domain/aggregates/role/CommunityPermissions';
import { UniqueEntityID } from '@core/domain/UniqueEntityID';

import { CreateRoleUseCase, CreateRoleValidationError, InvalidPermissions } from '../CreateRole';

describe('Create role use case', () => {
  it('should create new role successfully', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const personActor = new PersonActor({}, new UniqueEntityID());
    const request = {
      communityId: new CommunityID().toValue(),
      name: 'batata',
      permissions: ['ADMINISTRATOR'],
    };

    const roleOrError = await createRoleUseCase.execute(personActor, request);
    const { id } = roleOrError.run();

    const roleId = new RoleID(id);
    const storedRole = await roleRepository.getById(roleId);

    expect(roleOrError.isSuccess()).toBeTruthy();
    expect(storedRole!.id.equals(roleId)).toBeTruthy();
    expect(storedRole!.name.value).toBe(request.name);
    expect(storedRole!.permissions[0]).toBeInstanceOf(CommunityPermissions);
    expect(storedRole!.permissions[0].props.communityId?.toValue()).toEqual(
      request.communityId.toString(),
    );
    expect(storedRole!.permissions[0].props.permissions).toEqual(['ADMINISTRATOR']);
    expect(storedRole!.communityId.toValue()).toBe(request.communityId);
  });

  it('should throw error if name is invalid', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const personActor = new PersonActor({}, new UniqueEntityID());
    const request = {
      communityId: new CommunityID().toValue(),
      name: '',
      permissions: ['ADMINISTRATOR'],
    };

    const roleOrError = await createRoleUseCase.execute(personActor, request);
    expect(roleOrError.value).toBeInstanceOf(CreateRoleValidationError);
    expect(roleOrError.isFailure()).toBeTruthy();

    const storedRoles = await roleRepository.getAll();
    expect(storedRoles.length).toEqual(0);
  });

  it('should throw error if permissions is invalid', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const personActor = new PersonActor({}, new UniqueEntityID());
    const request = {
      communityId: new CommunityID().toValue(),
      name: 'batata',
      permissions: ['legal'],
    };

    const roleOrError = await createRoleUseCase.execute(personActor, request);
    expect(roleOrError.value).toBeInstanceOf(CreateRoleValidationError);
    expect(roleOrError.isFailure() && roleOrError.getError().message).toEqual(
      new InvalidPermissions([]).message,
    );
    expect(roleOrError.isFailure()).toBeTruthy();

    const storedRoles = await roleRepository.getAll();
    expect(storedRoles.length).toEqual(0);
  });
});
