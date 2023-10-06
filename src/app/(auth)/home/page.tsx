import { FamilyList } from '@/src/components/page'
import getFamilys from '../../actions/getFamilys'

export default async function Home() {
  const listFamily = await getFamilys()
  return (
    <div className="w-full">
      <FamilyList items={listFamily as any} />
    </div>
  )
}
