import { ApprovedList } from '@/src/components/page'
import getFamilys from '../../actions/getFamilys'


export default async function Approved() {
  const listFamily = await getFamilys()

  return (
    <div className="w-full">
      <ApprovedList items={listFamily as any} />
    </div>
  )
}
