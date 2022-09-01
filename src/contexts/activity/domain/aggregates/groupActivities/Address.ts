import { ValueObject } from '@core/domain/ValueObject';

export interface AddressProps {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
}

export class Address extends ValueObject<AddressProps> {
  private constructor(props: AddressProps) {
    super(props);
  }

  static create = (props: AddressProps): Address => {
    return new Address(props);
  };
}
