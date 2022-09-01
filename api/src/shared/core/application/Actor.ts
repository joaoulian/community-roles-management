import { Entity } from '@core/domain/Entity';
import { UniqueEntityID } from '@core/domain/UniqueEntityID';

export abstract class Actor<ID extends UniqueEntityID, Props = any> extends Entity<Props, ID> {
  get id(): ID {
    return this._id;
  }
}
