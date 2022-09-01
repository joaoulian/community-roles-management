import { AggregateRoot } from '@core/domain/AggregateRoot';

export interface Repository<Aggregate extends AggregateRoot<any, any>> {
  save(aggregate: Aggregate): Promise<void>;
  exists(aggregateId: Aggregate['id']): Promise<boolean>;
  getById(aggregateId: Aggregate['id']): Promise<Aggregate | null>;
  getAll(): Promise<Aggregate[]>;
}
