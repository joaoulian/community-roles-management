import { ValueObject } from '@core/domain/ValueObject';

export enum UsernameType {
  Twitter = 'twitter',
  Wallet = 'wallet',
}

export interface AllowedUserProps {
  username: string;
  usernameType: UsernameType;
}

export class AllowedUser extends ValueObject<AllowedUserProps> {
  private constructor(props: AllowedUserProps) {
    super(props);
  }

  static create = (props: AllowedUserProps): AllowedUser => {
    return new AllowedUser(props);
  };

  get username(): string {
    return this.props.username;
  }

  get usernameType(): UsernameType {
    return this.props.usernameType;
  }

  public equals(vo?: AllowedUser): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return vo.props.username === this.username;
  }
}
