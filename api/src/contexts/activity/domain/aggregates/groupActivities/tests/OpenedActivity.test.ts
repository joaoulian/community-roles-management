import { AttendeeAlreadyAdded, AttendeeNotFound } from '../OpenedActivity';
import { PersonID } from '../../PersonID';

import { mockOpenedActivity } from './mocks/Activity.mock';

describe('OpenedActivity', () => {
  describe('removeAttendee', () => {
    it('should remove attendee from the attendee`s list', () => {
      const personId = new PersonID();
      const activity = mockOpenedActivity({ attendees: [personId] });

      activity.removeAttendee(personId);

      expect(activity.attendees).toHaveLength(0);
    });

    it('should fail if attendee not exists on the list', () => {
      const personId = new PersonID();
      const activity = mockOpenedActivity({ attendees: [] });

      expect(() => {
        activity.removeAttendee(personId);
      }).toThrow(AttendeeNotFound);
    });
  });

  describe('addAttendee', () => {
    it('should add attendee to attendee`s list', () => {
      const personId = new PersonID();
      const activity = mockOpenedActivity({ attendees: [] });

      activity.addAttendee(personId);

      expect(activity.attendees).toHaveLength(1);
      expect(activity.attendees[0]).toEqual(personId);
    });

    it('should fail if attendee already added to the list', () => {
      const personId = new PersonID();
      const activity = mockOpenedActivity({ attendees: [personId] });

      expect(() => {
        activity.addAttendee(personId);
      }).toThrow(AttendeeAlreadyAdded);

      expect(activity.attendees).toHaveLength(1);
      expect(activity.attendees[0]).toEqual(personId);
    });
  });
});
