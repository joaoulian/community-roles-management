import { Name } from '@core/domain/valueObjects/Name';

import { CommunityID } from '../../CommunityID';
import { Permission } from '../../Permission';
import { Role, RoleProps } from '../../Role';

export const mockRole = (props: Partial<RoleProps>): Role => {
  const communityId = new CommunityID();
  const name = Name.create('role name');
  const permissions = [Permission.Administrator];
  return Role.create({
    allowList: [],
    communityId,
    name,
    permissions,
    ...props,
  });
};
