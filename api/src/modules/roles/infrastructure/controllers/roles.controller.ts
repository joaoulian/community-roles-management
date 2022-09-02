import { Request, Response, Router } from 'express';
import { Controller } from '@core/infrastructure/Controller';
import { CreateRoleUseCase } from '@roles/application/useCases/CreateRole';
import { roleRepositoryPrismaImpl } from '@roles/infrastructure/repositories';
import { MemberActor } from '@roles/application/actors/Member';
import { MemberID } from '@roles/domain/aggregates/role/MemberID';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';

class RolesController implements Controller {
  public path = '/role';
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.createRole);
  }

  createRole = async (_request: Request, response: Response) => {
    const createRoleUseCase = new CreateRoleUseCase(roleRepositoryPrismaImpl);

    await createRoleUseCase.execute(new MemberActor({}, new MemberID()), {
      allowList: ['@joaoulian'],
      communityId: new CommunityID().toValue(),
      name: 'batata',
      permissions: ['ADMINISTRATOR'],
    });

    response.json({ success: true });
  };
}

export default RolesController;
