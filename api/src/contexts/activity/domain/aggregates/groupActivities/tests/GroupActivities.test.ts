import { ActivityScheduledEvent } from '../events/ActivityScheduledEvent';
import { GroupActivities } from '../GroupActivities';
import { GroupID } from '../../GroupID';
import { PersonID } from '../../PersonID';
import { ActivityCanceledEvent } from '../events/ActivityCanceledEvent';
import { OpenedActivity } from '../OpenedActivity';
import { CanceledActivity } from '../CanceledActivity';
import { ActivityDescription } from '../ActivityDescription';
import { ActivityDescriptionUpdatedEvent } from '../events/ActivityDescriptionUpdatedEvent';
import { AttendeeLeavedActivityEvent } from '../events/AttendeeLeavedActivityEvent';
import { TimeInterval } from '../TimeInterval';
import { ActivityRescheduledEventEvent } from '../events/ActivityRescheduledEvent';
import { ActivityRelocatedEvent } from '../events/ActivityRelocatedEvent';

import { mockEndedActivity, mockOpenedActivity, validActivityProps } from './mocks/Activity.mock';
import { mockAddress } from './mocks/Address.mock';

describe('GroupActivities', () => {
  describe('create', () => {
    it('should create an instance', () => {
      const groupActivities = GroupActivities.create([], new GroupID());

      expect(groupActivities).toBeInstanceOf(GroupActivities);
      expect(groupActivities.activities).toHaveLength(0);
    });
  });

  describe('scheduleActivity', () => {
    it('should add activity to the group`s activity list', () => {
      const groupActivities = GroupActivities.create([], new GroupID());

      groupActivities.scheduleActivity(validActivityProps(), new PersonID());

      expect(groupActivities.activities).toHaveLength(1);
      expect(groupActivities.activities[0]).toBeInstanceOf(OpenedActivity);
    });

    it('should add domain event', () => {
      const groupActivities = GroupActivities.create([], new GroupID());

      groupActivities.scheduleActivity(validActivityProps(), new PersonID());

      expect(groupActivities.domainEvents.length).toBe(1);
      expect(groupActivities.domainEvents[0]).toBeInstanceOf(ActivityScheduledEvent);
    });
  });

  describe('cancelActivity', () => {
    it('should end an opened activity from the group`s activity list', () => {
      const activity = mockOpenedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();

      groupActivities.cancelActivity(activity.id, personId);

      expect(groupActivities.activities[0]).toBeInstanceOf(CanceledActivity);
    });

    it('should add domain event', () => {
      const activity = mockOpenedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();

      groupActivities.cancelActivity(activity.id, personId);

      expect(groupActivities.domainEvents.length).toBe(1);
      expect(groupActivities.domainEvents[0]).toBeInstanceOf(ActivityCanceledEvent);
    });

    it('should not add domain event if activity is already ended', () => {
      const activity = mockEndedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();

      groupActivities.cancelActivity(activity.id, personId);

      expect(groupActivities.domainEvents.length).toBe(0);
    });
  });

  describe('updateActivityDescription', () => {
    it('should update the description of opened activity', () => {
      const activity = mockOpenedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();
      const newDescription = ActivityDescription.create('batrokarkoarkoakoraok');

      groupActivities.updateActivityDescription(activity.id, newDescription, personId);

      expect(groupActivities.activities[0].description.equals(newDescription)).toBeTruthy();
    });

    it('should add domain event', () => {
      const activity = mockOpenedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();
      const newDescription = ActivityDescription.create('kkkkkkkkkkkkkkkkkk');

      groupActivities.updateActivityDescription(activity.id, newDescription, personId);

      expect(groupActivities.domainEvents.length).toBe(1);
      expect(groupActivities.domainEvents[0]).toBeInstanceOf(ActivityDescriptionUpdatedEvent);
    });

    it('should not update the description and add domain event if activity is ended', () => {
      const activity = mockEndedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();
      const newDescription = ActivityDescription.create('kkkkkkkkkkkkkkkkkk');

      groupActivities.updateActivityDescription(activity.id, newDescription, personId);

      expect(groupActivities.activities[0].description.equals(newDescription)).toBeFalsy();
      expect(groupActivities.domainEvents.length).toBe(0);
    });
  });

  describe('relocateActivity', () => {
    it('should update the location of opened activity', () => {
      const activity = mockOpenedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();
      const newLocation = mockAddress({ city: 'Ibitinga' });

      groupActivities.relocateActivity(activity.id, newLocation, personId);

      expect(groupActivities.activities[0].location.equals(newLocation)).toBeTruthy();
    });

    it('should add domain event', () => {
      const activity = mockOpenedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();
      const newLocation = mockAddress({ city: 'Ibitinga' });

      groupActivities.relocateActivity(activity.id, newLocation, personId);

      expect(groupActivities.domainEvents.length).toBe(1);
      expect(groupActivities.domainEvents[0]).toBeInstanceOf(ActivityRelocatedEvent);
    });

    it('should not update the location and add domain event if activity is ended', () => {
      const activity = mockEndedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();
      const newLocation = mockAddress({ city: 'Ibitinga' });

      groupActivities.relocateActivity(activity.id, newLocation, personId);

      expect(groupActivities.activities[0].location.equals(newLocation)).toBeFalsy();
      expect(groupActivities.domainEvents.length).toBe(0);
    });
  });

  describe('rescheduleActivity', () => {
    it('should update the description of opened activity', () => {
      const activity = mockOpenedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();
      const newTime = TimeInterval.create({
        start: new Date('2020-01-01'),
        end: new Date('2020-02-01'),
      });

      groupActivities.rescheduleActivity(activity.id, newTime, personId);

      expect(groupActivities.activities[0].time.equals(newTime)).toBeTruthy();
    });

    it('should add domain event', () => {
      const activity = mockOpenedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();
      const newTime = TimeInterval.create({
        start: new Date('2020-01-01'),
        end: new Date('2020-02-01'),
      });

      groupActivities.rescheduleActivity(activity.id, newTime, personId);

      expect(groupActivities.domainEvents.length).toBe(1);
      expect(groupActivities.domainEvents[0]).toBeInstanceOf(ActivityRescheduledEventEvent);
    });

    it('should not update the description and add domain event if activity is ended', () => {
      const activity = mockEndedActivity();
      const groupActivities = GroupActivities.create([activity], new GroupID());
      const personId = new PersonID();
      const newTime = TimeInterval.create({
        start: new Date('2020-01-01'),
        end: new Date('2020-02-01'),
      });

      groupActivities.rescheduleActivity(activity.id, newTime, personId);

      expect(groupActivities.activities[0].time.equals(newTime)).toBeFalsy();
      expect(groupActivities.domainEvents.length).toBe(0);
    });
  });

  describe('leaveActivity', () => {
    it('should leave attendee from opened activity and add domain event', () => {
      const personId = new PersonID();
      const activity = mockOpenedActivity({ attendees: [personId] });
      const groupActivities = GroupActivities.create([activity], new GroupID());

      groupActivities.leaveActivity(personId, activity.id);

      expect(activity.attendees).toHaveLength(0);
      expect(groupActivities.domainEvents).toHaveLength(1);
      expect(groupActivities.domainEvents[0]).toBeInstanceOf(AttendeeLeavedActivityEvent);
    });
  });
});
