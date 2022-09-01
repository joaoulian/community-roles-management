import { MemberActor } from '@activity/application/actors/Member';
import { mockOpenedActivity } from '@activity/domain/aggregates/groupActivities/tests/mocks/Activity.mock';
import { mockGroupActivities } from '@activity/domain/aggregates/groupActivities/tests/mocks/GroupActivities.mock';
import { GroupID } from '@activity/domain/aggregates/GroupID';
import { mockMember } from '@activity/domain/aggregates/member/tests/mocks/Member.mock';
import { MemoryGroupActivitiesRepository } from '@activity/infrastructure/MemoryGroupActivitiesRepository';

import { GroupNotFoundError, UserMustBeGroupAdminError } from '../errors';
import { LeaveActivityUseCase } from '../LeaveActivity';

describe('Leave activity use case', () => {
  it('should attendee leave activity', async () => {
    const member = mockMember();
    const groupRepository = new MemoryGroupActivitiesRepository();
    const leaveActivityUseCase = new LeaveActivityUseCase(groupRepository);
    const activity = mockOpenedActivity({ attendees: [member.id] });
    const group = mockGroupActivities([activity]);
    const memberActor = new MemberActor({ groupId: group.id }, member.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
    };

    await leaveActivityUseCase.execute(memberActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(1);
    expect(storedGroup!.activities[0].attendees).toHaveLength(0);
  });

  it('should return error if group is not found', async () => {
    const member = mockMember();
    const groupRepository = new MemoryGroupActivitiesRepository();
    const leaveActivityUseCase = new LeaveActivityUseCase(groupRepository);
    const activity = mockOpenedActivity({ attendees: [member.id] });
    const group = mockGroupActivities([activity]);
    const memberActor = new MemberActor({ groupId: group.id }, member.id);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
    };

    const response = await leaveActivityUseCase.execute(memberActor, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });

  it('should return error if member is not a member of the group', async () => {
    const member = mockMember();
    const groupRepository = new MemoryGroupActivitiesRepository();
    const leaveActivityUseCase = new LeaveActivityUseCase(groupRepository);
    const activity = mockOpenedActivity({ attendees: [member.id] });
    const group = mockGroupActivities([activity]);
    const memberActor = new MemberActor({ groupId: new GroupID() }, member.id);
    const request = {
      groupId: group.id.toString(),
      activityId: activity.id.toString(),
    };

    const response = await leaveActivityUseCase.execute(memberActor, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });
});
