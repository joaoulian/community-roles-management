import { Actor } from './Actor';

export interface UseCase<IRequest, IResponse> {
  execute: (actor: Actor<any>, request: IRequest) => Promise<IResponse | any>;
}
