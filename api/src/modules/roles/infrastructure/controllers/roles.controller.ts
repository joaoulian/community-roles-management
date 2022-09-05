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
    this.router.post(this.path, this.createRole);
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

    const responseDto = await createRoleUseCase.execute(new MemberActor({}, new MemberID()), dto);

    if (responseDto.isFailure()) response.status(500).send({ error: responseDto.value.message });
    else response.status(200).send({ id: responseDto.run().id });
  };
}

export default RolesController;
