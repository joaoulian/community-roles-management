import { ValueObject } from '@core/domain/ValueObject';

export interface TextProps {
  value: string;
}

export class Text extends ValueObject<TextProps> {
  protected static MIN_LENGTH = 3;
  protected static MAX_LENGTH = 100;

  static create(value: string): Text {
    this.validate(value);
    return new Text({ value });
  }

  private static validate(value: string): void {
    if (value === null || value === undefined) {
      throw new InvalidTextException('Text cannot be null or undefined');
    }
    if (value.length < this.MIN_LENGTH) {
      throw new InvalidTextException(
        `Text should have more than ${this.MIN_LENGTH - 1} characters`,
      );
    }
    if (value.length > this.MAX_LENGTH) {
      throw new InvalidTextException(
        `Text should have less than ${this.MAX_LENGTH + 1} characters`,
      );
    }
  }

  protected constructor(props: TextProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }
}

export class InvalidTextException extends Error {
  constructor(message: string) {
    super(message);
  }
}
