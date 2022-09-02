import { RoleRepositoryMemoryImpl } from '@roles/infrastructure/repositories/RoleRepositoryMemoryImpl';
import { MemberID } from '@roles/domain/aggregates/role/MemberID';
import { MemberActor } from '@roles/application/actors/Member';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { RoleID } from '@roles/domain/aggregates/role/RoleID';

import { CreateRoleUseCase, CreateRoleValidationError, InvalidPermissions } from '../CreateRole';

describe('Create role use case', () => {
  it('should add new role', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const memberActor = new MemberActor({}, new MemberID());
    const request = {
      allowList: ['@joaoulian'],
      communityId: new CommunityID().toValue(),
      name: 'batata',
      permissions: ['ADMINISTRATOR'],
    };

    const roleOrError = await createRoleUseCase.execute(memberActor, request);
    const { id } = roleOrError.run();

    const roleId = new RoleID(id);
    const storedRole = await roleRepository.getById(roleId);

    expect(roleOrError.isSuccess()).toBeTruthy();
    expect(storedRole!.id.equals(roleId)).toBeTruthy();
    expect(storedRole!.name.value).toBe(request.name);
    expect(Object.values(storedRole!.permissions)).toEqual(request.permissions);
    expect(storedRole!.communityId.toValue()).toBe(request.communityId);
    expect(storedRole!.allowList[0].username).toBe(request.allowList[0]);
  });

  it('should throw error if name is invalid', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const memberActor = new MemberActor({}, new MemberID());
    const request = {
      allowList: ['@joaoulian'],
      communityId: new CommunityID().toValue(),
      name: '',
      permissions: ['ADMINISTRATOR'],
    };

    const roleOrError = await createRoleUseCase.execute(memberActor, request);
    expect(roleOrError.value).toBeInstanceOf(CreateRoleValidationError);
    expect(roleOrError.isFailure()).toBeTruthy();

    const storedRoles = await roleRepository.getAll();
    expect(storedRoles.length).toEqual(0);
  });

  it('should throw error if permissions is invalid', async () => {
    const roleRepository = new RoleRepositoryMemoryImpl();
    const createRoleUseCase = new CreateRoleUseCase(roleRepository);
    const memberActor = new MemberActor({}, new MemberID());
    const request = {
      allowList: ['@joaoulian'],
      communityId: new CommunityID().toValue(),
      name: 'batata',
      permissions: ['legal'],
    };

    const roleOrError = await createRoleUseCase.execute(memberActor, request);
    expect(roleOrError.value).toBeInstanceOf(CreateRoleValidationError);
    expect(roleOrError.isFailure()).toBeTruthy();

    const storedRoles = await roleRepository.getAll();
    expect(storedRoles.length).toEqual(0);
  });
});
