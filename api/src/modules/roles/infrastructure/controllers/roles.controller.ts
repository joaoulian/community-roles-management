import { Request, Response, Router } from 'express';
import { Controller } from '@core/infrastructure/Controller';
import {
  CreateRoleUseCase,
  IRequest as CreateRoleDTO,
} from '@roles/application/useCases/CreateRole';
import { roleRepositoryPrismaImpl } from '@roles/infrastructure/repositories';
import { MemberActor } from '@roles/application/actors/Member';
import { MemberID } from '@roles/domain/aggregates/role/MemberID';

class RolesController implements Controller {
  public path = '/role';
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.createRole);
  }

  createRole = async (request: Request, response: Response) => {
    const createRoleUseCase = new CreateRoleUseCase(roleRepositoryPrismaImpl);

    const body = request.body;
    const dto: CreateRoleDTO = {
      allowList: body.allowList,
      communityId: body.communityId,
      name: body.name,
      permissions: body.permissions,
    };

    await createRoleUseCase.execute(new MemberActor({}, new MemberID()), dto);

    response.json({ success: true });
  };
}

export default RolesController;
