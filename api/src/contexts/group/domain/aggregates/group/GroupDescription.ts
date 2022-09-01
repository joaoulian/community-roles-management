import { Name } from '@core/domain/valueObjects/Name';

export class GroupDescription extends Name {
  protected static override MIN_LENGTH = 10;
  protected static override MAX_LENGTH = 1000;
}
