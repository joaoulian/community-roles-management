import { DomainEvent } from '../../DomainEvent';
import { UniqueEntityID } from '../../UniqueEntityID';
import { AggregateRoot } from '../../AggregateRoot';

export class FakeAggregateID extends UniqueEntityID {}

export class FakeAggregate extends AggregateRoot<any, FakeAggregateID> {
  exec() {
    this.addDomainEvent(new FakeEvent(this.id, {}));
  }
}

export class FakeEvent extends DomainEvent<FakeAggregateID, any> {}
