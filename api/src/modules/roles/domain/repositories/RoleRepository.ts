import { CommunityID } from '../aggregates/role/CommunityID';
import { Role } from '../aggregates/role/Role';

export interface RoleRepository {
  save(role: Role): Promise<void>;
  getRolesByCommunityId(communityId: CommunityID): Promise<Role[]>;
}
