import { GroupAdminActor } from '@activity/application/actors/GroupAdmin';
import { CanceledActivity } from '@activity/domain/aggregates/groupActivities/CanceledActivity';
import { mockOpenedActivity } from '@activity/domain/aggregates/groupActivities/tests/mocks/Activity.mock';
import { mockGroupActivities } from '@activity/domain/aggregates/groupActivities/tests/mocks/GroupActivities.mock';
import { mockGroupAdmin } from '@activity/domain/aggregates/groupAdmin/tests/mocks/GroupAdmin.mock';
import { GroupID } from '@activity/domain/aggregates/GroupID';
import { MemoryGroupActivitiesRepository } from '@activity/infrastructure/MemoryGroupActivitiesRepository';

import { CancelActivityUseCase } from '../CancelActivity';
import { GroupNotFoundError, UserMustBeGroupAdminError } from '../errors';

describe('Cancel activity use case', () => {
  it('should end activity', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const cancelActivityUseCase = new CancelActivityUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
    };

    await cancelActivityUseCase.execute(adminActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(1);
    expect(storedGroup!.activities[0]).toBeInstanceOf(CanceledActivity);
  });

  it('should return error if actor is not admin of the group', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const cancelActivityUseCase = new CancelActivityUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: new GroupID() }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
    };

    const response = await cancelActivityUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(UserMustBeGroupAdminError);
  });

  it('should return error if group is not found', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const cancelActivityUseCase = new CancelActivityUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
    };

    const response = await cancelActivityUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });
});
