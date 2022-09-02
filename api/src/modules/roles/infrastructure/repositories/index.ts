import { prismaClient } from '@shared/infrastructure/prisma/client';

import { RoleRepositoryPrismaImpl } from './RoleRepositoryPrismaImpl';

const roleRepositoryPrismaImpl = new RoleRepositoryPrismaImpl(prismaClient);

export { roleRepositoryPrismaImpl };
