import { Request, Response, Router } from 'express';
import { Controller } from '@core/infrastructure/Controller';
import {
  CreateRoleUseCase,
  IRequest as CreateRoleDTO,
} from '@roles/application/useCases/CreateRole';
import { roleRepositoryPrismaImpl } from '@roles/infrastructure/repositories';
import { MemberActor } from '@roles/application/actors/Member';
import { MemberID } from '@roles/domain/aggregates/role/MemberID';
import { GetRolesByCommunityId } from '@roles/application/useCases/GetRolesByCommunityId';

class RolesController implements Controller {
  public path = '/role';
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path, this.createRole);
    this.router.get(this.path, this.getRolesByCommunityId);
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

  getRolesByCommunityId = async (request: Request, response: Response) => {
    const communityId = Array.isArray(request.query.communityId)
      ? request.query.communityId[0].toString()
      : request.query.communityId?.toString();

    if (communityId) {
      const getRolesByCommunityIdUseCase = new GetRolesByCommunityId(roleRepositoryPrismaImpl);

      const responseDto = await getRolesByCommunityIdUseCase.execute(
        new MemberActor({}, new MemberID()),
        { communityId },
      );

      if (responseDto.isFailure()) response.status(500).send({ error: responseDto.value.message });
      else response.status(200).send(responseDto.run());
    } else {
      response.status(200).send({ error: 'Invalid community id' });
    }
  };
}

export default RolesController;
