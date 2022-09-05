import type { NextPage } from 'next'
import { useState } from 'react'
import { Tabs } from 'components/Tabs'
import { RolesTab } from 'views/RolesTab';

const Home: NextPage = () => {
  const [active, setActive] = useState<string | null>(null);
  const tabs = ['General', 'Roles'];

  return (
    <div className="w-full h-screen p-16 bg-slate-100">
      <div className="bg-white">
        <Tabs tabs={tabs} active={active} selectTab={(tab) => setActive(tab)} />
        <div className='px-4 py-8 h-full overflow-y-auto relative'>
          {active === 'Roles' && <RolesTab />}
        </div>
      </div>
    </div>
  )
}


export default Home
