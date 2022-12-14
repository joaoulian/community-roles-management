import { Permission } from "./Permission";

export const Permissions = (props: PermissionsProps) => {
  const isActive = (permissionName: string): boolean => {
    return props.activePermissions.includes(permissionName);
  }

  return (
    <div className="form-control w-full mb-4 gap-2">
      {props.allPermissions.map(({ name, description, title }, key) => (
        <Permission key={`permission-${key}`} name={name} title={title} description={description} checked={isActive(name)} onChange={props.onChange} />
      ))}
    </div>
  )
}

interface PermissionsProps {
  onChange: (permissionName: string) => void
  allPermissions: PermissionData[]
  activePermissions: string[]
}

export interface PermissionData {
  name: string;
  title: string;
  description: string;
}