import { ValueObject } from '@core/domain/ValueObject';

import { PersonID } from './PersonID';

interface MemberProps {
  personId: PersonID;
  deleted: boolean;
}

export class Member extends ValueObject<MemberProps> {
  static create(props: MemberProps): Member {
    return new Member(props);
  }

  private constructor(props: MemberProps) {
    super(props);
  }

  get personId(): PersonID {
    return this.props.personId;
  }

  get deleted(): boolean {
    return this.props.deleted;
  }

  withDeleted(): Member {
    return Member.create({ ...this.props, deleted: true });
  }
}
