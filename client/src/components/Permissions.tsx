import { useState } from "react";
import { Permission } from "./Permission";

export const Permissions = () => {
  const [permissions, setPermissions] = useState([
    {
      name: 'Manage Channels',
      description: 'Allows members to create, edit or delete channels',
      checked: false
    },
    { name: 'Manage Roles', description: 'Allows members to create, edit or delete roles', checked: false },
    { name: 'Manage Memberships', description: 'Allows managing community members', checked: false },
    { name: 'Manage Conversations', description: 'Allows managing conversations', checked: false },
    { name: 'Administrator', description: 'Allows full control of the community', checked: false }
  ]);

  const onChange = (name: string) => {
    const tempPermissions = [...permissions];
    const index = tempPermissions.findIndex(permission => permission.name === name)
    if (index >= 0) tempPermissions[index] = { ...permissions[index], checked: !permissions[index].checked }
    setPermissions(tempPermissions);
  }

  return (
    <div className="form-control w-full mb-4 gap-2">
      {permissions.map(({ name, description, checked }, key) => (
        <Permission key={`permission-${key}`} name={name} description={description} checked={checked} onChange={onChange} />
      ))}
    </div>
  )
}