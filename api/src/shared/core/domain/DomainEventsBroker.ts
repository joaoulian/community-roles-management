import { DomainEvent } from './DomainEvent';
import { AggregateRoot } from './AggregateRoot';
import { UniqueEntityID } from './UniqueEntityID';

export class DomainEventsBroker {
  private static handlersMap: { [eventName: string]: ((event: DomainEvent<any, any>) => void)[] } =
    {};

  public static dispatchAggregateEvents(aggregate: AggregateRoot<any, any>): void {
    aggregate.domainEvents.forEach((event: DomainEvent<any, any>) => this.dispatch(event));
    aggregate.clearEvents();
  }

  public static register(
    handler: (event: DomainEvent<any, any>) => void,
    eventClassName: string,
  ): void {
    if (!this.handlersMap[eventClassName]) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(handler);
  }

  public static clearHandlers(): void {
    this.handlersMap = {};
  }

  private static dispatch(event: DomainEvent<any, any>): void {
    const eventClassName: string = event.constructor.name;
    const handlers = this.handlersMap[eventClassName] ?? [];
    handlers.forEach((handler) => handler(event));
  }
}
