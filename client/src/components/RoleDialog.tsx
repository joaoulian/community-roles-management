import { Permissions } from './Permissions';

export const RoleDialog = () => {
  return (
    <div className="modal modal-bottom sm:modal-middle" id="role_modal">
      <div className="modal-box">
        <a href="#" className="btn btn-sm btn-circle absolute right-4 top-4">✕</a>
        <h2 className="font-bold text-lg">New Role</h2>

        <div className="py-4">
          <div className="form-control w-full mb-8">
            <label className="label" htmlFor="name">
              <span className="label-text">Role Name</span>
              <span className="label-text-alt">required</span>
            </label>
            <input
              type="text"
              placeholder="Enter name"
              name="name"
              className="input input-bordered w-full max-w-lg"
            />
          </div>

          <Permissions />
        </div>
        <div className="modal-action flex items-center justify-center">
          <button className="btn btn-primary"> Save </button>
        </div>
      </div>
    </div>
  )

}