import { GroupAdminActor } from '@activity/application/actors/GroupAdmin';
import { mockOpenedActivity } from '@activity/domain/aggregates/groupActivities/tests/mocks/Activity.mock';
import { mockGroupActivities } from '@activity/domain/aggregates/groupActivities/tests/mocks/GroupActivities.mock';
import { mockGroupAdmin } from '@activity/domain/aggregates/groupAdmin/tests/mocks/GroupAdmin.mock';
import { GroupID } from '@activity/domain/aggregates/GroupID';
import { MemoryGroupActivitiesRepository } from '@activity/infrastructure/MemoryGroupActivitiesRepository';

import { GroupNotFoundError, UserMustBeGroupAdminError } from '../errors';
import {
  UpdateActivityDescriptionUseCase,
  UpdateActivityDescriptionValidationError,
} from '../UpdateActivityDescription';

describe('Update activity description use case', () => {
  it('should update activity description', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const updateActivityDescriptionUseCase = new UpdateActivityDescriptionUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
      description: `${activity.description}abc`,
    };

    const response = await updateActivityDescriptionUseCase.execute(adminActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(1);
    expect(storedGroup!.activities[0].description.value).toEqual(request.description);
  });

  it('should return error if actor is not admin of the group', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const updateActivityDescriptionUseCase = new UpdateActivityDescriptionUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: new GroupID() }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
      description: `${activity.description}abc`,
    };

    const response = await updateActivityDescriptionUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(UserMustBeGroupAdminError);
  });

  it('should return error if group is not found', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const updateActivityDescriptionUseCase = new UpdateActivityDescriptionUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
      description: `${activity.description}abc`,
    };

    const response = await updateActivityDescriptionUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });

  it('should return error if new description is invalid', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const updateActivityDescriptionUseCase = new UpdateActivityDescriptionUseCase(groupRepository);
    const activity = mockOpenedActivity();
    const oldDescription = activity.description;
    const group = mockGroupActivities([activity]);
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
      description: '',
    };

    const response = await updateActivityDescriptionUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(UpdateActivityDescriptionValidationError);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(1);
    expect(storedGroup!.activities[0].description.equals(oldDescription)).toBeTruthy();
  });
});
