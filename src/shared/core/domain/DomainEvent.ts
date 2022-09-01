import { UniqueEntityID } from './UniqueEntityID';

export abstract class DomainEvent<ID extends UniqueEntityID, Payload> {
  constructor(
    public aggregateId: ID,
    readonly payload: Payload,
    public datetime: Date = new Date(),
  ) {}
}
