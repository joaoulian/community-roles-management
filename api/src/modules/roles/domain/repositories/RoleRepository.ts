import { CommunityID } from '../aggregates/role/CommunityID';
import { Role } from '../aggregates/role/Role';
import { RoleID } from '../aggregates/role/RoleID';

export interface RoleRepository {
  save(role: Role): Promise<void>;
  getRolesByCommunityId(communityId: CommunityID): Promise<Role[]>;
  getById(roleId: RoleID): Promise<Role | null>;
}
