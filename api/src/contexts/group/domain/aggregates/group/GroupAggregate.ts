import { AggregateRoot } from '@core/domain/AggregateRoot';

import { GroupAdminAddedEvent } from './events/GroupAdminAddedEvent';
import { GroupAdminDismissedEvent } from './events/GroupAdminDismissedEvent';
import { GroupCreatedEvent } from './events/GroupCreatedEvent';
import { GroupDescriptionUpdatedEvent } from './events/GroupDescriptionUpdatedEvent';
import { GroupNameUpdatedEvent } from './events/GroupNameUpdatedEvent';
import { MemberAddedEvent } from './events/MemberAddedEvent';
import { MemberRemovedEvent } from './events/MemberRemovedEvent';
import { MemberLeftEvent } from './events/MemberRemovedEvent copy';
import { GroupAdmin } from './GroupAdmin';
import { GroupDescription } from './GroupDescription';
import { GroupID } from './GroupID';
import { GroupName } from './GroupName';
import { Member } from './Member';
import { PersonID } from './PersonID';

export interface GroupProps {
  name: GroupName;
  description: GroupDescription;
  members: Member[];
  admins: GroupAdmin[];
}

export class GroupAggregate extends AggregateRoot<GroupProps, GroupID> {
  public static create(
    name: GroupName,
    description: GroupDescription,
    creatorId: PersonID,
  ): GroupAggregate {
    const member = Member.create({
      personId: creatorId,
      deleted: false,
    });
    const groupAdmin = GroupAdmin.create({
      personId: creatorId,
      deleted: false,
    });
    const group = new GroupAggregate(
      {
        name,
        description,
        members: [member],
        admins: [groupAdmin],
      },
      new GroupID(),
    );
    group.addDomainEvent(new GroupCreatedEvent(group.id, name, description, creatorId));
    return group;
  }

  constructor(props: GroupProps, id: GroupID) {
    super(props, id);
  }

  get name(): GroupName {
    return this.props.name;
  }

  set name(name: GroupName) {
    this.props.name = name;
    this.addDomainEvent(new GroupNameUpdatedEvent(this.id, name));
  }

  get description(): GroupName {
    return this.props.description;
  }

  set description(description: GroupName) {
    this.props.description = description;
    this.addDomainEvent(new GroupDescriptionUpdatedEvent(this.id, description));
  }

  get members(): Member[] {
    return this.props.members.filter((member) => !member.deleted);
  }

  get admins(): GroupAdmin[] {
    return this.props.admins.filter((admin) => !admin.deleted);
  }

  hasAdmin(personId: PersonID): boolean {
    return this.admins.find((admin) => admin.personId.equals(personId)) !== undefined;
  }

  hasMember(personId: PersonID): boolean {
    return this.members.find((member) => member.personId.equals(personId)) !== undefined;
  }

  addAdmin(personId: PersonID): void {
    const isMember = this.members.some((member) => member.personId.equals(personId));
    if (!isMember) {
      throw new GroupAdminMustBeMemberException(personId);
    }
    const isAdmin = this.admins.some((admin) => admin.personId.equals(personId));
    if (!isAdmin) {
      const newAdmin = GroupAdmin.create({
        personId,
        deleted: false,
      });
      this.props.admins.push(newAdmin);
      this.addDomainEvent(new GroupAdminAddedEvent(this.id, personId));
    }
  }

  dismissAdmin(personId: PersonID): void {
    const admin = this.admins.find((admin) => admin.personId.equals(personId));
    if (admin) {
      const index = this.props.admins.indexOf(admin);
      this.props.admins.splice(index, 1);
      this.props.admins.push(admin.withDeleted());
      this.addDomainEvent(new GroupAdminDismissedEvent(this.id, personId));
    }
  }

  addMember(personId: PersonID): void {
    const member = this.members.find((member) => member.personId.equals(personId));
    if (!member) {
      const newMember = Member.create({
        personId,
        deleted: false,
      });
      this.props.members.push(newMember);
      this.addDomainEvent(new MemberAddedEvent(this.id, personId));
    }
  }

  removeMember(personId: PersonID): void {
    const member = this.members.find((member) => member.personId.equals(personId));
    if (member) {
      const index = this.props.members.indexOf(member);
      this.props.members.splice(index, 1);
      this.props.members.push(member.withDeleted());
      this.addDomainEvent(new MemberRemovedEvent(this.id, personId));
    }
  }

  leaveMember(personId: PersonID): void {
    const member = this.members.find((member) => member.personId.equals(personId));
    if (member) {
      const index = this.props.members.indexOf(member);
      this.props.members.splice(index, 1);
      this.props.members.push(member.withDeleted());
      this.addDomainEvent(new MemberLeftEvent(this.id, personId));
    }
  }
}

export class GroupAdminMustBeMemberException extends Error {
  constructor(public readonly personId: PersonID) {
    super('The person must be a member of the group to be an admin');
  }
}
