import { RoleRepositoryMemoryImpl } from '@roles/infrastructure/repositories/RoleRepositoryMemoryImpl';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { RoleID } from '@roles/domain/aggregates/role/RoleID';
import { CommunityPermissions } from '@roles/domain/aggregates/role/CommunityPermissions';
import { mockContext } from '@core/application/tests/mocks/Context.mock';
import { ForbiddenError } from '@core/application/ForbiddenError';
import { mockRole } from '@roles/domain/aggregates/role/tests/mocks/Role.mock';
import { UserID } from '@roles/domain/aggregates/role/UserID';
import { mockCommunityPermissions } from '@roles/domain/aggregates/role/tests/mocks/Permissions.mock';
import { RoleFacade } from '@roles/application/facades/RoleFacade';
import { ChannelID } from '@roles/domain/aggregates/role/ChannelID';

import { AddChannelPermissionsToRole } from '../AddChannelPermissionsToRole';

describe('Add channel permissions to role', () => {
  it('should add channel permissions to role successfully', async () => {
    const userId = new UserID('user-id');
    const communityId = new CommunityID('community-id');
    const channelId = new ChannelID('channel-id');
    const role = mockRole({
      users: [userId],
      communityId,
      permissions: [
        mockCommunityPermissions({
          communityId,
          permissions: [RoleFacade.CommunityPermission.Administrator],
        }),
      ],
    });
    const roleRepository = new RoleRepositoryMemoryImpl();
    await roleRepository.save(role);
    const context = mockContext(userId.toValue(), { [communityId.toValue()]: ['ADMINISTRATOR'] });
    const addChannelPermissionsUseCase = new AddChannelPermissionsToRole(roleRepository);
    const request = {
      channelId: channelId.toValue(),
      permissions: ['ADMINISTRATOR'],
      roleId: role.id.toValue(),
    };

    const roleOrError = await addChannelPermissionsUseCase.execute(request, context);

    const storedRole = await roleRepository.getById(role.id);

    expect(roleOrError.isSuccess()).toBeTruthy();
    expect(storedRole!.permissions).toHaveLength(2);
  });
});
