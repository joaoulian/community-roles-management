import { GroupID } from '../GroupID';
import { GroupAdmin } from '../GroupAdmin';
import { PersonID } from '../PersonID';

describe('GroupAdmin', () => {
  it('should create an instance', () => {
    expect(
      GroupAdmin.create({
        personId: new PersonID(),
        deleted: false,
      }),
    ).toBeTruthy();
  });

  it('should return a deleted group admin', () => {
    const groupAdmin = GroupAdmin.create({
      personId: new PersonID(),
      deleted: false,
    });

    const deletedGroupAdmin = groupAdmin.withDeleted();

    expect(deletedGroupAdmin.props.deleted).toBe(true);
  });
});
