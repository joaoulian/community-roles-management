export const RolesList = () => {
  const roles = ['Admins', 'Moderators', 'Members', 'Everyone'];

  return (
    <div className="grid gap-6">
      {roles.map((role, key) => (
        <div key={`role-${key}`} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img src="https://api.lorem.space/image/face" />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium">{role}</p>
              <p className="text-sm">{Math.floor(10 * Math.random())} members</p>
            </div>
          </div>
          <div className="flex items-center">
            <button className="btn btn-outline text-base-content">Edit</button>
          </div>
        </div>
      ))}
    </div>
  )
}