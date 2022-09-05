import { RoleDialog, RoleToBeSaved } from 'components/RoleDialog';
import { RolesList } from 'components/RolesList';
import { useState } from 'react';

export const RolesTab = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  const rolesString = ['Admins', 'Moderators', 'Members', 'Everyone'];
  const roles = rolesString.map(role => ({ name: role, members: Math.floor(10 * Math.random()) }))

  const onEdit = (roleName: string) => {
    setRole(roleName);
    setDialogOpen(true);
  }

  const onClose = () => {
    setDialogOpen(false);
    setRole(null);
  }

  const update = async (role: RoleToBeSaved & { id: string }) => {
    console.log('updating', role)
  }

  const create = async (role: RoleToBeSaved & { id: undefined }) => {
    console.log('creating', role)
  }

  const onSaveRole = async (role: RoleToBeSaved) => {
    if (!!role.id) update({ ...role, id: role.id });
    else create({ ...role, id: undefined });
  }

  return (
    <>
      <div id="roles" data-tab-content className="w-full">
        <div className="mb-24">
          <Header />
          <RolesList onEdit={onEdit} roles={roles} />
          {dialogOpen && <RoleDialog open={dialogOpen} closeDialog={onClose} role={role ? { id: 'x', name: role, permissions: [] } : undefined} onSave={onSaveRole} />}
          <button className="btn btn-primary mt-12" onClick={() => setDialogOpen(true)}>New Role</button>
        </div>
      </div>
    </>
  )
}


const Header = () => {
  return (
    <>
      <h3 className="text-3xl font-medium">Roles</h3>
      <p className=" mb-10">Determine the roles members have in the community</p>
    </>
  )
}