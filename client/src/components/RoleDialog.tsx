import { useEffect, useState } from "react";
import { Allowlist } from "./Allowlist";
import { Permissions } from './Permissions';
import { Tabs } from "./Tabs";

const ALL_PERMISSIONS = [
  {
    name: 'MANAGE_CHANNELS',
    title: 'Manage channels',
    description: 'Allows members to create, edit or delete channels',
  },
  { name: 'MANAGE_ROLES', title: 'Manage Roles', description: 'Allows members to create, edit or delete roles' },
  { name: 'MANAGE_MEMBERSHIPS', title: 'Manage Memberships', description: 'Allows managing community members' },
  { name: 'MANAGE_CONVERSATIONS', title: 'Manage conversations', description: 'Allows managing conversations' },
  { name: 'ADMINISTRATOR', title: 'Administrator', description: 'Allows full control of the community' }
];

const TABS = ['Permissions', 'Allowlist'];

export const RoleDialog = (props: RoleDialogProps) => {
  const [name, setName] = useState<string>('');
  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>(TABS[0])
  const [allowlist, setAllowlist] = useState<string[]>([])

  const editMode = !!props.role;

  useEffect(() => {
    if (props.role) {
      setActivePermissions(props.role.permissions);
      setName(props.role.name);
      setAllowlist([])
    }
  }, [props.role])

  const onChange = (name: string) => {
    const tempActivePermissions = [...activePermissions];
    const index = tempActivePermissions.findIndex(perm => perm === name);
    if (index >= 0) tempActivePermissions.splice(index, 1);
    else tempActivePermissions.push(name);
    setActivePermissions(tempActivePermissions);
  }

  const onSave = () => {
    props.onSave({
      name,
      permissions: activePermissions,
      id: props.role?.id ?? undefined
    })
  }

  const addUser = (user: string) => {
    const tempAllowlist = [...allowlist];
    tempAllowlist.push(user);
    setAllowlist(tempAllowlist);
  }

  const removeUser = (user: string) => {
    const tempAllowlist = [...allowlist];
    const index = allowlist.findIndex(item => item === user);
    if (index >= 0) tempAllowlist.splice(index, 1);
    setAllowlist(tempAllowlist);
  }

  return (
    <div className={`modal modal-bottom sm:modal-middle ${props.open ? 'modal-open' : ''}`} id="role_modal">
      < div className="modal-box">
        <button onClick={props.closeDialog} className="btn btn-sm btn-circle absolute right-4 top-4">✕</button>
        <h2 className="font-bold text-lg">{editMode ? 'Edit role' : 'New Role'}</h2>
        <div className="py-4">
          <div className="form-control w-full mb-8">
            <label className="label" htmlFor="role-name">
              <span className="label-text">Role Name</span>
              <span className="label-text-alt">required</span>
            </label>
            <input
              className="input input-bordered w-full max-w-lg"
              type="text"
              placeholder="Enter name"
              name="role-name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <Tabs tabs={TABS} active={activeTab} selectTab={(tab) => setActiveTab(tab)} />
          <div className="px-4 py-8 h-full overflow-y-auto relative">
            {activeTab === 'Permissions' && <Permissions activePermissions={activePermissions} allPermissions={ALL_PERMISSIONS} onChange={onChange} />}
            {activeTab === 'Allowlist' && <Allowlist list={allowlist} add={addUser} remove={removeUser} />}
          </div>
        </div>
        <div className="modal-action flex items-center justify-center">
          <button className="btn btn-primary" onClick={onSave}> Save </button>
        </div>
      </div>
    </div >
  )
}

interface RoleDialogProps {
  open: boolean;
  closeDialog: () => void;
  role?: Role;
  onSave: (role: RoleToBeSaved) => Promise<void>;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface RoleToBeSaved {
  id?: string;
  name: string;
  permissions: string[];
}