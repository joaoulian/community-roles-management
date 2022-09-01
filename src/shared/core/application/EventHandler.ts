import { DomainEvent } from '../domain/DomainEvent';

export interface EventHandler<E extends DomainEvent<any, any>> {
  setupSubscriptions(): void;
  handle: (event: E) => void;
}
