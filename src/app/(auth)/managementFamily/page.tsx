import { ManagementFamilyList } from '@/src/components/page'
import axios from 'axios'

export default async function ManagementFamily() {
  const listFamily = await axios.get('http://localhost:3000/api/familys')
  console.log(listFamily.data)
  return (
    <div className="w-full">
      <ManagementFamilyList items={listFamily.data} />
    </div>
  )
}
