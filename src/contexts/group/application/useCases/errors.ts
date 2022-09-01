export class GroupNotFoundError extends Error {
  constructor(readonly groupId: string) {
    super('Group not found');
  }
}

export class UserMustBeGroupAdminError extends Error {
  constructor(readonly groupId: string, readonly personId: string) {
    super('User must be a group admin');
  }
}
