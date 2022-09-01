import { PersonID } from '../PersonID';

import { Activity, ActivityProps, ActivityStatus } from './Activity';
import { ActivityDescription } from './ActivityDescription';
import { ActivityID } from './ActivityID';
import { Address } from './Address';
import { TimeInterval } from './TimeInterval';

interface CanceledActivityProps extends ActivityProps {}

export class CanceledActivity extends Activity<CanceledActivityProps> {
  status = ActivityStatus.Canceled;

  private constructor(props: CanceledActivityProps, id: ActivityID) {
    super(props, id);
  }

  get time(): TimeInterval {
    return this.props.time;
  }

  get description(): ActivityDescription {
    return this.props.description;
  }

  get attendees(): PersonID[] {
    return this.props.attendees;
  }

  get location(): Address {
    return this.props.location;
  }

  static create(props: CanceledActivityProps, id: ActivityID): CanceledActivity {
    const activity = new CanceledActivity(props, id);
    return activity;
  }
}
