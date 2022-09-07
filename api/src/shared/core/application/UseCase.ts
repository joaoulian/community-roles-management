import { Context } from './Context';

export interface UseCase<IRequest, IResponse> {
  execute: (request: IRequest, context?: Context) => Promise<IResponse | any>;
}
