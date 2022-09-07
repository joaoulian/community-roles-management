import { roleQueryModel } from '@roles/infrastructure/query';

import { RoleFacade } from './RoleFacade';

const facade = new RoleFacade(roleQueryModel);

export default facade;
