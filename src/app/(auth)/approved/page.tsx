import { ApprovedList } from '@/src/components/page'
import { getFamilys } from '../services/callApi'


export default async function Approved() {
  const listFamily = await getFamilys()

  return (
    <div className="w-full">
      <ApprovedList items={listFamily.data} />
    </div>
  )
}
