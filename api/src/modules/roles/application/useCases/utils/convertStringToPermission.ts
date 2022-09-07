import { ChannelPermission, CommunityPermission } from '@roles/domain/aggregates/role/Permission';

export function convertStringToCommunityPermission(value: string): CommunityPermission | undefined {
  return Object.values(CommunityPermission).find((enumValue) => enumValue === value);
}

export function convertStringToChannelPermission(value: string): ChannelPermission | undefined {
  return Object.values(ChannelPermission).find((enumValue) => enumValue === value);
}
