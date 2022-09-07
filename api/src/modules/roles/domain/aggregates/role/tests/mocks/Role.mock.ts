import { Name } from '@core/domain/valueObjects/Name';

import { CommunityID } from '../../CommunityID';
import { Role, RoleProps } from '../../Role';

import { mockCommunityPermissions } from './Permissions.mock';

export const mockRole = (props?: Partial<RoleProps>): Role => {
  const communityId = new CommunityID();
  const name = Name.create('role name');
  const communityPermissions = mockCommunityPermissions();
  const permissions = [communityPermissions];
  return Role.create({
    communityId,
    name,
    permissions,
    users: [],
    ...props,
  });
};
