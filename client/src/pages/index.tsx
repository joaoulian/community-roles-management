import { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { Tabs } from 'components/Tabs'
import { RolesTab } from 'views/RolesTab';

const Home: NextPage = () => {
  const [active, setActive] = useState<string | null>(null);
  const router = useRouter()
  const tabs = ['General', 'Roles'];

  const communityId = Array.isArray(router.query.community_id) ? router.query.community_id[0] : router.query.community_id;

  if (!communityId) return (
    <div className="w-full h-screen p-16 bg-slate-100">
      <div className="bg-white">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Community not founded</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full h-screen p-16 bg-slate-100">
      <div className="bg-white">
        <Tabs tabs={tabs} active={active} selectTab={(tab) => setActive(tab)} />
        <div className='px-4 py-8 h-full overflow-y-auto relative'>
          {active === 'Roles' && <RolesTab communityId={communityId} />}
        </div>
      </div>
    </div>
  )
}


export default Home
