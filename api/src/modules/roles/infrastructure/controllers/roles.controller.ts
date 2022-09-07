import { Request, Response, Router } from 'express';
import { Controller } from '@core/infrastructure/Controller';
import {
  CreateRoleUseCase,
  IRequest as CreateRoleDTO,
} from '@roles/application/useCases/CreateRole';
import { roleRepositoryPrismaImpl } from '@roles/infrastructure/repositories';
import { PersonActor } from '@roles/application/actors/Person';
import { UniqueEntityID } from '@core/domain/UniqueEntityID';

import { roleQueryModel } from '../query';

class RolesController implements Controller {
  public path = '/role';
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path, this.createRole);
    this.router.get(`${this.path}/:id`, this.getRoleById);
  }

  createRole = async (request: Request, response: Response) => {
    const createRoleUseCase = new CreateRoleUseCase(roleRepositoryPrismaImpl);

    const body = request.body;
    const dto: CreateRoleDTO = {
      communityId: body.communityId,
      name: body.name,
      permissions: body.permissions,
    };

    const responseDto = await createRoleUseCase.execute(
      new PersonActor({}, new UniqueEntityID()),
      dto,
    );

    if (responseDto.isFailure()) response.status(500).send({ error: responseDto.value.message });
    else response.status(200).send({ id: responseDto.run().id });
  };

  getRoleById = async (request: Request, response: Response) => {
    const role = await roleQueryModel.getRoleById(request.params.id);
    response.status(200).send(role);
  };
}

export default RolesController;
