import { RoleDialog, RoleToBeSaved } from 'components/RoleDialog';
import { RolesList } from 'components/RolesList';
import { useEffect, useState } from 'react';
import { APIError, roleService } from 'services/RoleService';
import { toast } from 'react-toastify';

export const RolesTab = (props: RolesTabProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [role, setRole] = useState<any | null>(null);
  const [loadedRoles, setLoadedRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    loadRoles();
  }, [])

  const loadRoles = async () => {
    const { roles } = await roleService.getRolesByCommunityId(props.communityId);
    setLoadedRoles(roles ?? []);
    setLoading(false);
  }

  const onEdit = (roleId: string) => {
    const existentRole = loadedRoles.find(role => role.id === roleId);
    if (existentRole) {
      setRole(existentRole);
      setDialogOpen(true);
    }
  }

  const onClose = () => {
    setRole(null);
    setDialogOpen(false);
  }

  const update = async (role: RoleToBeSaved & { id: string }) => {
    const response = await roleService.updateRole(role.id, {
      name: role.name,
      permissions: role.permissions
    });

    if (response instanceof APIError) {
      toast.error(response.message);
    } else {
      onClose();
      loadRoles();
      toast.success("Updated sucessfully");
    }
  }

  const create = async (role: RoleToBeSaved & { id: undefined }) => {
    const response = await roleService.createRole({
      allowList: [],
      communityId: props.communityId,
      name: role.name,
      permissions: role.permissions
    })

    if (response instanceof APIError) {
      toast.error(response.message);
    } else {
      onClose();
      loadRoles();
      toast.success("Created sucessfully");
    }
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
          {loading ? <progress className="progress w-56"></progress> : <RolesList onEdit={onEdit} roles={loadedRoles} />}
          {dialogOpen && <RoleDialog open={dialogOpen} closeDialog={onClose} role={role ? { id: role.id, name: role.name, permissions: role.permissions } : undefined} onSave={onSaveRole} />}
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

export interface RolesTabProps {
  communityId: string;
}