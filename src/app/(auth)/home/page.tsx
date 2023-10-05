import { FamilyList } from '@/src/components/page'
import axios from 'axios'

export default async function Home() {
  const listFamily = await axios.get('/api/familys')
  return (
    <div className="w-full">
      <FamilyList items={listFamily.data} />
    </div>
  )
}
