import getFamilysByUser from '@/src/app/actions/getFamilysByUser'
import { ManagementFamilyList } from '@/src/components/page'


interface ManagementFamilyProps {
  params: {
    id: string
  }
}

export default async function ManagementFamily({
  params
}: ManagementFamilyProps) {
  const userId = params.id
  const listFamily = await getFamilysByUser({userId})

  return (
    <div className="w-full">
      <ManagementFamilyList items={listFamily as any} userId={userId} />
    </div>
  )
}
