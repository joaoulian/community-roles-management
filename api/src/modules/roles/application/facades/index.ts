import { roleQueryModel } from '@roles/infrastructure/query';

import { RoleFacade } from './RoleFacade';

const roleFacade = new RoleFacade(roleQueryModel);

export { roleFacade };
