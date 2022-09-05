export const Permission = (props: PermissionProps) => {
  return (
    <div className="flex flex-col p-2 border-b">
      <h4 className="flex w-full justify-between items-cemter font-bold">
        {props.name}
        <label className="label cursor-pointer">
          <input type="checkbox" className="toggle toggle-primary" checked={props.checked} onChange={() => props.onChange(props.name)} />
        </label>
      </h4>
      <p className="mb-2">{props.description}</p>
    </div>
  )
}

export interface PermissionProps {
  name: string;
  description: string;
  checked: boolean;
  onChange: (name: string) => void;
}