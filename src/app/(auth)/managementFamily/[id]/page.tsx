import { ManagementFamilyList } from '@/src/components/page'
import axios from 'axios'

interface ManagementFamilyProps {
  params: {
    id: string
  }
}

export default async function ManagementFamily({
  params
}: ManagementFamilyProps) {
  const userId = params.id
  const listFamily = await axios.get(`http://localhost:3000/api/user/${userId}`)

  return (
    <div className="w-full">
      <ManagementFamilyList items={listFamily.data} />
    </div>
  )
}
