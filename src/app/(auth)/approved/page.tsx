import getFamilys from '@/src/actions/getFamilys'
import { ApprovedList } from '@/src/components/page'



export default async function Approved() {
  const listFamily = await getFamilys()

  return (
    <div className="w-full">
      <ApprovedList items={listFamily} />
    </div>
  )
}
