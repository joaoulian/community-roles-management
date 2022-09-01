import { Name } from '../Name';

describe('Name', () => {
  class CustomName extends Name {
    protected static override MIN_LENGTH = 10;
    protected static override MAX_LENGTH = 100;
  }

  it('should fail if group name is undefined', () => {
    expect(() => CustomName.create(undefined as any)).toThrowError();
  });

  it('should fail if group name is null', () => {
    expect(() => CustomName.create(null as any)).toThrowError();
  });

  it('should fail if group name has 0 characters', () => {
    expect(() => CustomName.create('')).toThrowError();
  });

  it('should fail if group name has 9 characters', () => {
    expect(() => CustomName.create('a'.repeat(9))).toThrowError();
  });

  it('should create a group name with 10 characters', () => {
    expect(CustomName.create('a'.repeat(10))).toBeTruthy();
  });

  it('should create a group name with 100 characters', () => {
    expect(CustomName.create('a'.repeat(100))).toBeTruthy();
  });

  it('should fail if group name has 101 characters', () => {
    expect(() => CustomName.create('a'.repeat(101))).toThrowError();
  });
});
