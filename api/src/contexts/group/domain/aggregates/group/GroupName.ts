import { Name } from '@core/domain/valueObjects/Name';

export class GroupName extends Name {
  protected static override MIN_LENGTH = 3;
  protected static override MAX_LENGTH = 100;
}
