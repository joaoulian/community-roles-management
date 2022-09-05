import { MemoryRepository } from '@core/infrastructure/repositories/MemoryRepository';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';
import { Role } from '@roles/domain/aggregates/role/Role';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

export class RoleRepositoryMemoryImpl extends MemoryRepository<Role> implements RoleRepository {
  getRolesByCommunityId(communityId: CommunityID): Promise<Role[]> {
    return Promise.resolve(this.aggregates);
  }
}
