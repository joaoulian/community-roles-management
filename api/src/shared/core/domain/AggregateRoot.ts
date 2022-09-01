import { Entity } from './Entity';
import { DomainEvent } from './DomainEvent';
import { UniqueEntityID } from './UniqueEntityID';

export abstract class AggregateRoot<Props, ID extends UniqueEntityID> extends Entity<Props, ID> {
  private _domainEvents: DomainEvent<ID, any>[] = [];

  get id(): ID {
    return this._id;
  }

  get domainEvents(): DomainEvent<ID, any>[] {
    return this._domainEvents;
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  protected addDomainEvent(domainEvent: DomainEvent<ID, any>): void {
    this._domainEvents.push(domainEvent);
  }
}
