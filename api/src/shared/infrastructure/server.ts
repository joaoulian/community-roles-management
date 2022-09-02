import RolesController from '@roles/infrastructure/controllers/roles.controller';

import App from './app';

const app = new App([new RolesController()], 5000);

app.listen();
