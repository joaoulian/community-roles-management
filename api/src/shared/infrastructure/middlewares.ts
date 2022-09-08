import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { ContextBuilder } from './context/ContextBuilder';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('Calling error handler');
  console.log(err);
  res.status(500).send({ error: 'Error' });
};

export async function contextMiddleware(req: Request, res: Response, next: NextFunction) {
  const context = await new ContextBuilder().build(req, res);
  // eslint-disable-next-line require-atomic-updates
  res.locals.user = context;
  next();
}
