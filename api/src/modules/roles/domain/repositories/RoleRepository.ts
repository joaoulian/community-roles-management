import { Role } from '../aggregates/role/Role';

export interface RoleRepository {
  save(role: Role): Promise<void>;
}
