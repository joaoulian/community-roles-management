import { Request, Response, Router } from 'express';
import { Controller } from '@core/infrastructure/Controller';
import {
  CreateRoleUseCase,
  IRequest as CreateRoleDTO,
} from '@roles/application/useCases/CreateRole';
import { roleRepositoryPrismaImpl } from '@roles/infrastructure/repositories';
import { Context } from '@core/application/Context';
import { RoleFacade } from '@roles/application/facades/RoleFacade';

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
    this.router.get(`${this.path}`, this.getRolesByCommunityId);
  }

  private canView(communityId: string, context?: Context): boolean {
    if (!context) return false;
    const permissions = context.getResourcePermissions(communityId);
    return (
      permissions.includes(RoleFacade.CommunityPermission.Administrator) ||
      permissions.includes(RoleFacade.CommunityPermission.ManageRoles)
    );
  }

  createRole = async (request: Request, response: Response) => {
    const context = response.locals.user;
    const createRoleUseCase = new CreateRoleUseCase(roleRepositoryPrismaImpl);

    const body = request.body;
    const dto: CreateRoleDTO = {
      communityId: body.communityId,
      name: body.name,
      permissions: body.permissions,
      users: body.users,
    };

    const responseDto = await createRoleUseCase.execute(dto, context);
    if (responseDto.isFailure())
      return response.status(500).send({ error: responseDto.value.message });
    return response.status(200).send({ id: responseDto.run().id });
  };

  getRoleById = async (request: Request, response: Response) => {
    const context = response.locals.user;

    const role = await roleQueryModel.getRoleById(request.params.id);
    if (!role) return response.status(404).send({ error: 'Role not founded' });

    const canView = this.canView(role!.communityId, context);
    if (!canView) return response.status(403).send({ error: 'Forbidden' });

    return response.status(200).send(role);
  };

  getRolesByCommunityId = async (request: Request, response: Response) => {
    const context = response.locals.user;

    const communityId = Array.isArray(request.query.communityId)
      ? request.query.communityId[0].toString()
      : request.query.communityId?.toString();

    if (!communityId) return response.status(500).send({ error: 'Invalid community ID' });

    const canView = this.canView(communityId, context);
    if (!canView) return response.status(403).send({ error: 'Forbidden' });

    const roles = await roleQueryModel.getRolesByCommunityId(communityId);

    return response.status(200).send(roles);
  };
}

export default RolesController;
