import { prismaClient } from '@shared/infrastructure/prisma/client';

import { RoleQueryModel } from './RoleQueryModel';

const roleQueryModel = new RoleQueryModel(prismaClient);

export { roleQueryModel };
