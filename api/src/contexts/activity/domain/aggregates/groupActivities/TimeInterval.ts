import { DomainError } from '@core/domain/DomainError';
import { ValueObject } from '@core/domain/ValueObject';

export interface TimeIntervalProps {
  start: Date;
  end: Date;
}

export class TimeInterval extends ValueObject<TimeIntervalProps> {
  private constructor(props: TimeIntervalProps) {
    super(props);
  }

  get start(): Date {
    return this.props.start;
  }

  get end(): Date {
    return this.props.end;
  }

  static create = ({ start, end }: TimeIntervalProps): TimeInterval => {
    if (end.getTime() < start.getTime()) throw new InvalidTimeInterval();
    return new TimeInterval({ start, end });
  };
}

export class InvalidTimeInterval extends DomainError {
  constructor() {
    super('Invalid time interval');
  }
}
