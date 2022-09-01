import { Address, AddressProps } from '../../Address';

export function mockAddress(props?: Partial<AddressProps>): Address {
  return Address.create({
    city: 'Tangamangapio',
    neighborhood: 'Fadiga',
    number: '42',
    state: 'Michoacán',
    street: 'Rua Jaiminho',
    zipcode: '14940000',
    ...props,
  });
}
