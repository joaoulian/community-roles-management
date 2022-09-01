import { DomainEventsBroker } from '../DomainEventsBroker';

import { FakeAggregate, FakeAggregateID, FakeEvent } from './mocks/FakeAggregate.mock';

describe('Domain Events', () => {
  let executedHandlers: number[] = [];

  const handler1 = (_event: FakeEvent) => {
    executedHandlers.push(1);
  };
  const handler2 = (_event: FakeEvent) => {
    executedHandlers.push(2);
  };
  const handler3 = (_event: any) => {
    executedHandlers.push(3);
  };

  beforeEach(() => {
    executedHandlers = [];
    DomainEventsBroker.clearHandlers();
    DomainEventsBroker.register(handler1, FakeEvent.name);
    DomainEventsBroker.register(handler2, FakeEvent.name);
    DomainEventsBroker.register(handler3, 'OtherEvent');
  });

  describe('Register handlers and trigger them when event is dispatched', () => {
    it('Should trigger handlers', () => {
      const aggregate = new FakeAggregate({}, new FakeAggregateID());

      aggregate.exec();
      DomainEventsBroker.dispatchAggregateEvents(aggregate);

      expect(executedHandlers.length).toEqual(2);
      expect(executedHandlers.every((x) => x === 1 || x === 2)).toBeTruthy();
    });
  });
});
