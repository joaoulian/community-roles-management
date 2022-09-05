export const RolesList = (props: RolesListProps) => {
  return (
    <div className="grid gap-6">
      {props.roles.map((role, key) => (
        <div key={`role-${key}`} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img src="https://api.lorem.space/image/face" />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium">{role.name}</p>
              <p className="text-sm">{role.members} members</p>
            </div>
          </div>
          <div className="flex items-center">
            <button className="btn btn-outline text-base-content" onClick={() => props.onEdit(role.name)}>Edit</button>
          </div>
        </div>
      ))}
    </div>
  )
}

interface RolesListProps {
  onEdit: (roleName: string) => void;
  roles: {
    name: string;
    members: number;
  }[]
}