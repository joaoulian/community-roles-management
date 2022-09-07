import { Context } from '@core/application/Context';

export const mockContext = (userId?: string, permissionsMap?: { [key: string]: string[] }) => {
  return new Context(
    userId ?? 'user-id',
    permissionsMap ?? {
      '1': ['ADMINISTRATOR'],
    },
  );
};
