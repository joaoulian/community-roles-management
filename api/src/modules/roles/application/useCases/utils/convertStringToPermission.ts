import { Permission } from '@roles/domain/aggregates/role/Permission';

export function convertStringToPermission(value: string): Permission | undefined {
  return Object.values(Permission).find((enumValue) => enumValue === value);
}
