import { GroupAdminActor } from '@activity/application/actors/GroupAdmin';
import { mockGroupActivities } from '@activity/domain/aggregates/groupActivities/tests/mocks/GroupActivities.mock';
import { mockGroupAdmin } from '@activity/domain/aggregates/groupAdmin/tests/mocks/GroupAdmin.mock';
import { GroupID } from '@activity/domain/aggregates/GroupID';
import { MemoryGroupActivitiesRepository } from '@activity/infrastructure/MemoryGroupActivitiesRepository';

import { GroupNotFoundError, UserMustBeGroupAdminError } from '../errors';
import { ScheduleActivityUseCase, ScheduleActivityValidationError } from '../ScheduleActivity';

describe('Schedule activity use case', () => {
  it('should schedule activity', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const scheduleActivityUseCase = new ScheduleActivityUseCase(groupRepository);
    const group = mockGroupActivities();
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-02-01'),
      description: 'new description',
      location: {
        city: 'Tangamangapio',
        neighborhood: 'Fadiga',
        number: '42',
        state: 'Michoacán',
        street: 'Rua Jaiminho',
        zipcode: '14940000',
      },
    };

    await scheduleActivityUseCase.execute(adminActor, request);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(1);
    expect(storedGroup!.activities[0].description.value).toEqual(request.description);
    expect(storedGroup!.activities[0].time.start).toEqual(request.startDate);
    expect(storedGroup!.activities[0].time.end).toEqual(request.endDate);
  });

  it('should return error if actor is not admin of the group', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const scheduleActivityUseCase = new ScheduleActivityUseCase(groupRepository);
    const group = mockGroupActivities();
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: new GroupID() }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-02-01'),
      description: 'new description',
      location: {
        city: 'Tangamangapio',
        neighborhood: 'Fadiga',
        number: '42',
        state: 'Michoacán',
        street: 'Rua Jaiminho',
        zipcode: '14940000',
      },
    };

    const response = await scheduleActivityUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(UserMustBeGroupAdminError);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(0);
  });

  it('should return error if group is not found', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const scheduleActivityUseCase = new ScheduleActivityUseCase(groupRepository);
    const group = mockGroupActivities();
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    const request = {
      groupId: group.id.toString(),
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-02-01'),
      description: 'new description',
      location: {
        city: 'Tangamangapio',
        neighborhood: 'Fadiga',
        number: '42',
        state: 'Michoacán',
        street: 'Rua Jaiminho',
        zipcode: '14940000',
      },
    };

    const response = await scheduleActivityUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(GroupNotFoundError);
  });

  it('should return error if description is invalid', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const scheduleActivityUseCase = new ScheduleActivityUseCase(groupRepository);
    const group = mockGroupActivities();
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-02-01'),
      description: '',
      location: {
        city: 'Tangamangapio',
        neighborhood: 'Fadiga',
        number: '42',
        state: 'Michoacán',
        street: 'Rua Jaiminho',
        zipcode: '14940000',
      },
    };

    const response = await scheduleActivityUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(ScheduleActivityValidationError);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(0);
  });

  it('should return error if time interval is invalid', async () => {
    const groupRepository = new MemoryGroupActivitiesRepository();
    const scheduleActivityUseCase = new ScheduleActivityUseCase(groupRepository);
    const group = mockGroupActivities();
    const admin = mockGroupAdmin(group.id);
    const adminActor = new GroupAdminActor({ groupId: group.id }, admin.id);
    groupRepository.save(group);
    const request = {
      groupId: group.id.toString(),
      startDate: new Date('2022-02-01'),
      endDate: new Date('2022-01-01'),
      description: 'valid desc',
      location: {
        city: 'Tangamangapio',
        neighborhood: 'Fadiga',
        number: '42',
        state: 'Michoacán',
        street: 'Rua Jaiminho',
        zipcode: '14940000',
      },
    };

    const response = await scheduleActivityUseCase.execute(adminActor, request);

    expect(response.value).toBeInstanceOf(ScheduleActivityValidationError);

    const storedGroup = await groupRepository.getById(group.id);
    expect(storedGroup!.activities).toHaveLength(0);
  });
});
