import { ManagementFamilyList } from '@/src/components/page'
import { getFamilysByUser } from '../../services/callApi'

interface ManagementFamilyProps {
  params: {
    id: string
  }
}

export default async function ManagementFamily({
  params
}: ManagementFamilyProps) {
  const userId = params.id
  const listFamily = await getFamilysByUser(userId)

  return (
    <div className="w-full">
      <ManagementFamilyList items={listFamily.data} userId={userId} />
    </div>
  )
}
