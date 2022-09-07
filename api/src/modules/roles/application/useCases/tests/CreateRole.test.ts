import { RoleRepositoryMemoryImpl } from '@roles/infrastructure/repositories/RoleRepositoryMemoryImpl';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { RoleID } from '@roles/domain/aggregates/role/RoleID';
import { CommunityPermissions } from '@roles/domain/aggregates/role/CommunityPermissions';
import { mockContext } from '@core/application/tests/mocks/Context.mock';
import { ForbiddenError } from '@core/application/ForbiddenError';

import { CreateRoleUseCase, CreateRoleValidationError, InvalidPermissions } from '../CreateRole';

describe('Create role use case', () => {
  it('should create new role successfully', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const request = {
      communityId: new CommunityID().toValue(),
      name: 'batata',
      permissions: ['ADMINISTRATOR'],
      users: [],
    };
    const context = mockContext('user-id', { [request.communityId]: ['ADMINISTRATOR'] });

    const roleOrError = await createRoleUseCase.execute(request, context);
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
    const request = {
      communityId: new CommunityID().toValue(),
      name: '',
      permissions: ['ADMINISTRATOR'],
      users: [],
    };
    const context = mockContext('user-id', { [request.communityId]: ['ADMINISTRATOR'] });

    const roleOrError = await createRoleUseCase.execute(request, context);
    expect(roleOrError.value).toBeInstanceOf(CreateRoleValidationError);
    expect(roleOrError.isFailure()).toBeTruthy();

    const storedRoles = await roleRepository.getAll();
    expect(storedRoles.length).toEqual(0);
  });

  it('should throw error if permissions is invalid', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const request = {
      communityId: new CommunityID().toValue(),
      name: 'batata',
      permissions: ['legal'],
      users: [],
    };
    const context = mockContext('user-id', { [request.communityId]: ['ADMINISTRATOR'] });

    const roleOrError = await createRoleUseCase.execute(request, context);
    expect(roleOrError.value).toBeInstanceOf(CreateRoleValidationError);
    expect(roleOrError.isFailure() && roleOrError.getError().message).toEqual(
      new InvalidPermissions([]).message,
    );
    expect(roleOrError.isFailure()).toBeTruthy();

    const storedRoles = await roleRepository.getAll();
    expect(storedRoles.length).toEqual(0);
  });

  it('should throw forbidden error if user context dont have right permissions', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const request = {
      communityId: new CommunityID().toValue(),
      name: 'batata',
      permissions: ['ADMINISTRATOR'],
      users: [],
    };
    const context = mockContext('user-id', { [request.communityId]: ['MANAGE_MEMBERSHIPS'] });

    let error;
    try {
      await createRoleUseCase.execute(request, context);
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(ForbiddenError);
  });

  it('should not throw forbidden error if context user has ADMINISTRATOR permission', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const request = {
      communityId: new CommunityID().toValue(),
      name: 'batata',
      permissions: ['ADMINISTRATOR'],
      users: [],
    };
    const context = mockContext('user-id', { [request.communityId]: ['ADMINISTRATOR'] });

    const response = await createRoleUseCase.execute(request, context);
    expect(response.isSuccess()).toBeTruthy();
  });

  it('should not throw forbidden error if context user has MANAGE_ROLES permission', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const request = {
      communityId: new CommunityID().toValue(),
      name: 'batata',
      permissions: ['ADMINISTRATOR'],
      users: [],
    };
    const context = mockContext('user-id', { [request.communityId]: ['MANAGE_ROLES'] });

    const response = await createRoleUseCase.execute(request, context);
    expect(response.isSuccess()).toBeTruthy();
  });
});
