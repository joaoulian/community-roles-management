import { useState } from "react";

export const Allowlist = (props: AllowlistProps) => {
  const [username, setUsername] = useState<string>('')

  const addUser = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      props.add(username);
      setUsername("");
    }
  }


  return (
    <div id="allowlist" className="w-full grid gap-6">
      <div className="grid gap-6">
        <input
          type="text"
          placeholder="Add member email, wallet, or twitter username"
          name="address"
          className="input input-bordered w-full max-w-lg"
          onKeyDown={addUser}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        {props.list.map((username, key) => (
          <div className="flex items-center justify-between" key={`allow-list-user-${key}`}>
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium">{username}</span>
            </div>
            <div className="flex items-center">
              <span className="material-icons-outlined text-base-300 hover:text-base-content" onClick={() => props.remove(username)}>
                close
              </span>
            </div>
          </div>
        ))}
      </div>
    </div >
  )
}

export interface AllowlistProps {
  list: string[],
  add: (username: string) => void;
  remove: (username: string) => void;
}