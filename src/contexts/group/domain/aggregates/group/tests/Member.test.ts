import { Member } from '../Member';
import { PersonID } from '../PersonID';

describe('Member', () => {
  it('should create an instance', () => {
    expect(
      Member.create({
        personId: new PersonID(),
        deleted: false,
      }),
    ).toBeTruthy();
  });

  it('should return a deleted member', () => {
    const member = Member.create({
      personId: new PersonID(),
      deleted: false,
    });

    const deletedMember = member.withDeleted();

    expect(deletedMember.props.deleted).toBe(true);
  });
});
