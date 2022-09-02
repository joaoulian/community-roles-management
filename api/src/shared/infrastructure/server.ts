import express, { Router, Request, Response } from 'express';
import { roleRepositoryPrismaImpl } from '@roles/infrastructure';
import { CreateRoleUseCase } from '@roles/application/useCases/CreateRole';
import { MemberActor } from '@roles/application/actors/Member';
import { MemberID } from '@roles/domain/aggregates/role/MemberID';
import { CommunityID } from '@roles/domain/aggregates/role/CommunityID';

const app = express();

const route = Router();

app.use(express.json());

route.get('/', async (req: Request, res: Response) => {
  const createRoleUseCase = new CreateRoleUseCase(roleRepositoryPrismaImpl);

  await createRoleUseCase.execute(new MemberActor({}, new MemberID()), {
    allowList: ['@joaoulian'],
    communityId: new CommunityID().toValue(),
    name: 'batata',
    permissions: ['ADMINISTRATOR'],
  });

  res.json({ success: true });
});

app.use(route);

app.listen(5000, () => 'server running on port 3333');
