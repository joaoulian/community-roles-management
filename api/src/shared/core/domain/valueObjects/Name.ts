import { ValueObject } from '@core/domain/ValueObject';

export interface NameProps {
  value: string;
}

export class Name extends ValueObject<NameProps> {
  protected static MIN_LENGTH = 3;
  protected static MAX_LENGTH = 100;

  static create(value: string): Name {
    this.validate(value);
    return new Name({ value });
  }

  private static validate(value: string): void {
    if (value === null || value === undefined) {
      throw new InvalidNameException('Name cannot be null or undefined');
    }
    if (value.length < this.MIN_LENGTH) {
      throw new InvalidNameException(
        `Name should have more than ${this.MIN_LENGTH - 1} characters`,
      );
    }
    if (value.length > this.MAX_LENGTH) {
      throw new InvalidNameException(
        `Name should have less than ${this.MAX_LENGTH + 1} characters`,
      );
    }
  }

  protected constructor(props: NameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }
}

export class InvalidNameException extends Error {
  constructor(message: string) {
    super(message);
  }
}
