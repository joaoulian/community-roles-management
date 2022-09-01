import { ActivityProps } from '../../Activity';
import { ActivityID } from '../../ActivityID';
import { CanceledActivity } from '../../CanceledActivity';
import { OpenedActivity } from '../../OpenedActivity';
import { TimeInterval } from '../../TimeInterval';

import { mockValidActivityDescription } from './ActivityDescription.mock';
import { mockAddress } from './Address.mock';

export function validActivityProps(): ActivityProps {
  return {
    attendees: [],
    description: mockValidActivityDescription(),
    time: TimeInterval.create({
      start: new Date('2022-01-01'),
      end: new Date('2022-01-02'),
    }),
    location: mockAddress(),
  };
}

export const mockOpenedActivity = (props?: Partial<ActivityProps>): OpenedActivity =>
  OpenedActivity.create({
    ...validActivityProps(),
    ...props,
  });

export const mockEndedActivity = (props?: Partial<ActivityProps>): CanceledActivity =>
  CanceledActivity.create(
    {
      ...validActivityProps(),
      ...props,
    },
    new ActivityID(),
  );
