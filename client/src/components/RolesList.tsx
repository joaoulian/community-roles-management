export const RolesList = (props: RolesListProps) => {
  return (
    <div className="grid gap-6">
      {props.roles.map((role, key) => (
        <div key={`role-${key}`} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-lg font-medium">{role.name}</p>
              <p className="text-sm">{role.members} members</p>
            </div>
          </div>
          <div className="flex items-center">
            <button className="btn btn-outline text-base-content" onClick={() => props.onEdit(role.id)}>Edit</button>
          </div>
        </div>
      ))}
    </div>
  )
}

interface RolesListProps {
  onEdit: (roleId: string) => void;
  roles: {
    id: string;
    name: string;
    members: number;
  }[]
}
