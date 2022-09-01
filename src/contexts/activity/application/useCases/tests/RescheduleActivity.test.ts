import { GroupAdminActor } from '@activity/application/actors/GroupAdmin';
import {
  mockEndedActivity,
  mockOpenedActivity,
} from '@activity/domain/aggregates/groupActivities/tests/mocks/Activity.mock';
import { mockGroupActivities } from '@activity/domain/aggregates/groupActivities/tests/mocks/GroupActivities.mock';
import { mockGroupAdmin } from '@activity/domain/aggregates/groupAdmin/tests/mocks/GroupAdmin.mock';
import { GroupID } from '@activity/domain/aggregates/GroupID';
import { MemoryGroupActivitiesRepository } from '@activity/infrastructure/MemoryGroupActivitiesRepository';

import { GroupNotFoundError, UserMustBeGroupAdminError } from '../errors';
import {
  RescheduleActivityUseCase,
  RescheduleActivityValidationError,
} from '../RescheduleActivity';

describe('Reschedule activity use case', () => {
  it('should reschedule activity', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const rescheduleActivityUseCase = new RescheduleActivityUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-02-01'),
    };

    await rescheduleActivityUseCase.execute(adminActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(1);
    expect(storedGroup!.activities[0].time.start).toEqual(request.startDate);
    expect(storedGroup!.activities[0].time.end).toEqual(request.endDate);
  });

  it('should return error if actor is not admin of the group', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const rescheduleActivityUseCase = new RescheduleActivityUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: new GroupID() }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-02-01'),
    };

    const response = await rescheduleActivityUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(UserMustBeGroupAdminError);
  });

  it('should return error if group is not found', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const rescheduleActivityUseCase = new RescheduleActivityUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-02-01'),
    };

    const response = await rescheduleActivityUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });

  it('should return error if new time interval is invalid', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const rescheduleActivityUseCase = new RescheduleActivityUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const oldTime = activity.time;
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
      startDate: new Date('2022-02-01'),
      endDate: new Date('2022-01-01'),
    };

    const response = await rescheduleActivityUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(RescheduleActivityValidationError);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(1);
    expect(storedGroup!.activities[0].time.start).toEqual(oldTime.start);
    expect(storedGroup!.activities[0].time.end).toEqual(oldTime.end);
  });

  it('should not reschedule a ended activity', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const rescheduleActivityUseCase = new RescheduleActivityUseCase(groupRepository);
    const activity = mockEndedActivity();
    const oldTime = activity.time;
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-02-01'),
    };

    await rescheduleActivityUseCase.execute(adminActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(1);
    expect(storedGroup!.activities[0].time.start).toEqual(oldTime.start);
    expect(storedGroup!.activities[0].time.end).toEqual(oldTime.end);
  });
});
