import { PersonID } from '../PersonID';

import { Activity, ActivityProps, ActivityStatus } from './Activity';
import { ActivityDescription } from './ActivityDescription';
import { ActivityID } from './ActivityID';
import { Address } from './Address';
import { TimeInterval } from './TimeInterval';

interface OpenedActivityProps extends ActivityProps {}

export class OpenedActivity extends Activity<OpenedActivityProps> {
  status = ActivityStatus.Opened;

  private constructor(props: OpenedActivityProps, id: ActivityID) {
    super(props, id);
  }

  get time(): TimeInterval {
    return this.props.time;
  }

  set time(time: TimeInterval) {
    this.props.time = time;
  }

  get attendees(): PersonID[] {
    return this.props.attendees;
  }

  get description(): ActivityDescription {
    return this.props.description;
  }

  set description(description: ActivityDescription) {
    this.props.description = description;
  }

  get location(): Address {
    return this.props.location;
  }

  set location(newAddress: Address) {
    this.props.location = newAddress;
  }

  private findAttendee(personId: PersonID): PersonID | undefined {
    return this.attendees.find((attendee) => attendee.equals(personId));
  }

  addAttendee(personId: PersonID): void {
    const existentAttendee = this.findAttendee(personId);
    if (existentAttendee) throw new AttendeeAlreadyAdded(personId);
    this.attendees.push(personId);
  }

  removeAttendee(personId: PersonID): void {
    const attendee = this.findAttendee(personId);
    if (!attendee) throw new AttendeeNotFound(personId);
    const index = this.attendees.indexOf(attendee);
    this.props.attendees.splice(index, 1);
  }

  static create(props: OpenedActivityProps, id?: ActivityID): OpenedActivity {
    const activity = new OpenedActivity(props, id ?? new ActivityID());
    return activity;
  }
}

export class AttendeeNotFound extends Error {
  constructor(public readonly personId: PersonID) {
    super('Attendee not found');
  }
}

export class AttendeeAlreadyAdded extends Error {
  constructor(public readonly personId: PersonID) {
    super('Attendee already added to activity');
  }
}
