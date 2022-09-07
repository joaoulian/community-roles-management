import { UniqueEntityID } from '@core/domain/UniqueEntityID';

export class UserID extends UniqueEntityID {
  readonly name: 'UserID' = 'UserID';
}
