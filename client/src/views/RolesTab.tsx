import { RoleDialog } from 'components/RoleDialog';
import { RolesList } from 'components/RolesList';
import { useState } from 'react';

export const RolesTab = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  const onEdit = (roleName: string) => {
    setRole(roleName);
    setDialogOpen(true);
  }

  const onClose = () => {
    setDialogOpen(false);
    setRole(null);
  }

  return (
    <>
      <div id="roles" data-tab-content className="w-full">
        <div className="mb-24">
          <Header />
          <RolesList onEdit={onEdit} />
          {dialogOpen && <RoleDialog open={dialogOpen} closeDialog={onClose} role={role ? { id: 'x', name: role, permissions: [] } : undefined} />}
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