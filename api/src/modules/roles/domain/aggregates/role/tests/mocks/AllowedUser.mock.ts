import { AllowedUser, AllowedUserProps, UsernameType } from '../../AllowedUser';

export const mockAllowedUser = (props?: Partial<AllowedUserProps>): AllowedUser =>
  AllowedUser.create({
    username: '@username',
    usernameType: UsernameType.Twitter,
    ...props,
  });
