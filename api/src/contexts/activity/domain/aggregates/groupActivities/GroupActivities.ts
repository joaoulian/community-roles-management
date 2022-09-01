import { AggregateRoot } from '@core/domain/AggregateRoot';

import { GroupID } from '../GroupID';
import { PersonID } from '../PersonID';

import { Activity } from './Activity';
import { ActivityDescription } from './ActivityDescription';
import { ActivityID } from './ActivityID';
import { CanceledActivity } from './CanceledActivity';
import { ActivityDescriptionUpdatedEvent } from './events/ActivityDescriptionUpdatedEvent';
import { ActivityCanceledEvent } from './events/ActivityCanceledEvent';
import { ActivityRescheduledEventEvent } from './events/ActivityRescheduledEvent';
import { ActivityScheduledEvent } from './events/ActivityScheduledEvent';
import { AttendeeLeavedActivityEvent } from './events/AttendeeLeavedActivityEvent';
import { OpenedActivity } from './OpenedActivity';
import { TimeInterval } from './TimeInterval';
import { Address } from './Address';
import { ActivityRelocatedEvent } from './events/ActivityRelocatedEvent';

interface GroupActivitiesProps {
  activities: Activity[];
}

interface ScheduleActivityProps {
  time: TimeInterval;
  description: ActivityDescription;
  location: Address;
}

export class GroupActivities extends AggregateRoot<GroupActivitiesProps, GroupID> {
  private constructor(props: GroupActivitiesProps, id: GroupID) {
    super(props, id);
  }

  get activities(): Activity[] {
    return this.props.activities;
  }

  static create(activities: Activity[], id: GroupID): GroupActivities {
    const groupActivities = new GroupActivities({ activities }, id);
    return groupActivities;
  }

  private replaceActivity(oldActivity: Activity, newActivity: Activity) {
    const index = this.activities.indexOf(oldActivity);
    this.props.activities.splice(index, 1);
    this.props.activities.push(newActivity);
  }

  private findActivity(activityId: ActivityID): Activity | undefined {
    return this.activities.find((activity) => activity.id.equals(activityId));
  }

  scheduleActivity(props: ScheduleActivityProps, scheduler: PersonID): void {
    const activity = OpenedActivity.create({
      time: props.time,
      description: props.description,
      attendees: [],
      location: props.location,
    });
    this.props.activities.push(activity);
    this.addDomainEvent(new ActivityScheduledEvent(this.id, scheduler, activity));
  }

  cancelActivity(activityId: ActivityID, personId: PersonID): void {
    const activity = this.findActivity(activityId);
    if (activity instanceof OpenedActivity) {
      const endedActivity = CanceledActivity.create(activity.props, activity.id);
      this.replaceActivity(activity, endedActivity);
      this.addDomainEvent(new ActivityCanceledEvent(this.id, personId, endedActivity));
    }
  }

  rescheduleActivity(activityId: ActivityID, time: TimeInterval, personId: PersonID): void {
    const activity = this.findActivity(activityId);
    if (activity instanceof OpenedActivity) {
      activity.time = time;
      this.addDomainEvent(new ActivityRescheduledEventEvent(this.id, personId, activity));
    }
  }

  updateActivityDescription(
    activityId: ActivityID,
    description: ActivityDescription,
    personId: PersonID,
  ): void {
    const activity = this.findActivity(activityId);
    if (activity instanceof OpenedActivity) {
      activity.description = description;
      this.addDomainEvent(new ActivityDescriptionUpdatedEvent(this.id, personId, activity));
    }
  }

  relocateActivity(activityId: ActivityID, location: Address, personId: PersonID): void {
    const activity = this.findActivity(activityId);
    if (activity instanceof OpenedActivity) {
      activity.location = location;
      this.addDomainEvent(new ActivityRelocatedEvent(this.id, personId, activity));
    }
  }

  leaveActivity(personId: PersonID, activityId: ActivityID) {
    const activity = this.findActivity(activityId);

    if (activity instanceof OpenedActivity) {
      activity.removeAttendee(personId);
      this.addDomainEvent(new AttendeeLeavedActivityEvent(this.id, activity, personId));
    }
  }
}
