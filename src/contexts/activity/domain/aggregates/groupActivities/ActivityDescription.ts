import { Text } from '@core/domain/valueObjects/Text';

export class ActivityDescription extends Text {
  protected static override MIN_LENGTH = 10;
  protected static override MAX_LENGTH = 1000;
}
