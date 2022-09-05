import { RoleDialog } from 'components/RoleDialog';
import { RolesList } from 'components/RolesList';

export const RolesTab = () => {
  return (
    <>
      <div id="roles" data-tab-content className="w-full">
        <div className="mb-24">
          <Header />
          <RolesList />
          <RoleDialog />
          <a className="btn btn-primary mt-12" href="#role_modal">New Role</a>
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