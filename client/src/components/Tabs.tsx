export const Tabs = (props: TabsProps) => {
  return (
    <div className="navbar bg-white border-b">
      <div className="flex-1">
        <select className="md:hidden select max-w-xs" onChange={(e) => props.selectTab(e.target.value)}>
          {props.tabs.map((tab, key) => (
            <option data-tab={tab.toLowerCase()} key={`mobile-tab-${key}`}>{tab}</option>
          ))}
        </select>
        <div className="tabs hidden md:inline-block">
          {props.tabs.map((tab, key) => (
            <button
              key={`tab-${key}`}
              onClick={() => props.selectTab(tab)}
              className={props.active === tab ? 'tab tab-active' : 'tab'}
              data-tab={tab.toLowerCase()}>{tab}</button
            >
          ))}
        </div>
      </div>
    </div>
  )
}

export interface TabsProps {
  tabs: string[],
  active: string | null,
  selectTab: (tab: string) => void
}