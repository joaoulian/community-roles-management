import { UniqueEntityID } from '@core/domain/UniqueEntityID';

export class PersonID extends UniqueEntityID {
  readonly name: 'PersonID' = 'PersonID';
}
