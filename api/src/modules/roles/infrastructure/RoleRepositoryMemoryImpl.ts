import { MemoryRepository } from '@core/infrastructure/repositories/MemoryRepository';
import { Role } from '@roles/domain/aggregates/role/Role';
import { RoleRepository } from '@roles/domain/repositories/RoleRepository';

export class RoleRepositoryMemoryImpl extends MemoryRepository<Role> implements RoleRepository {}
