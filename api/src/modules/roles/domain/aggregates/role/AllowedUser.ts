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
}
