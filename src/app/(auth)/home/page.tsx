import { FamilyList } from '@/src/components/page'
import { getFamilys } from '../services/callApi'


export default async function Home() {
  const listFamily = await getFamilys()

  return (
    <div className="w-full">
      <FamilyList items={listFamily.data} />
    </div>
  )
}
