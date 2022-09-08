import { Request, Response } from 'express';
import { roleFacade } from '@roles/application/facades';
import { Context } from '@core/application/Context';

export class ContextBuilder {
  constructor() {}

  async build(req: Request, res: Response): Promise<Context | undefined> {
    const userId = Array.isArray(req.headers.user) ? req.headers.user[0] : req.headers.user;
    if (!userId) return undefined;

    return this.buildContext(userId);
  }

  private async buildContext(userId: string) {
    const permissions = await roleFacade.getUserPermissions(userId);
    return new Context(userId, permissions);
  }
}
