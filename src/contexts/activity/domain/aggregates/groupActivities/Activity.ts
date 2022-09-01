import { Entity } from '@core/domain/Entity';

import { PersonID } from '../PersonID';

import { ActivityDescription } from './ActivityDescription';
import { ActivityID } from './ActivityID';
import { Address } from './Address';
import { TimeInterval } from './TimeInterval';

export enum ActivityStatus {
  Opened = 'opened',
  Canceled = 'canceled',
}

export interface ActivityProps {
  time: TimeInterval;
  description: ActivityDescription;
  attendees: PersonID[];
  location: Address;
}

export abstract class Activity<T extends ActivityProps = ActivityProps> extends Entity<
  T,
  ActivityID
> {
  abstract status: ActivityStatus;

  protected constructor(props: T, id: ActivityID) {
    super(props, id);
  }

  abstract get time(): TimeInterval;
  abstract get description(): ActivityDescription;
  abstract get attendees(): PersonID[];
  abstract get location(): Address;
}
