import { AggregateRoot } from '@core/domain/AggregateRoot';
import { Repository } from '@core/domain/Repository';

export class MemoryRepository<Aggregate extends AggregateRoot<any, any>>
  implements Repository<Aggregate>
{
  protected aggregates: Aggregate[] = [];

  async save(aggregate: Aggregate): Promise<void> {
    this.aggregates.push(aggregate);
  }

  async exists(aggregateId: Aggregate['id']): Promise<boolean> {
    return this.aggregates.some((aggregate) => aggregate.id.equals(aggregateId));
  }

  async getById(aggregateId: Aggregate['id']): Promise<Aggregate | null> {
    return this.aggregates.find((aggregate) => aggregate.id.equals(aggregateId)) ?? null;
  }

  async getAll(): Promise<Aggregate[]> {
    return this.aggregates;
  }
}
