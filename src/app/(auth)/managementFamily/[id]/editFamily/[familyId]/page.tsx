import getFamilyDetails from '@/src/actions/getFamilyDetails'
import { FamilyForm } from '@/src/components/page'

interface EditFamilyProps {
  params: {
    id: string
    familyId: string
  }
}

export default async function EditFamily({ params }: EditFamilyProps) {
  const familyId = params.familyId
  const userId = params.id
  const listFamily = await getFamilyDetails({ familyId })

  return (
    <div className="w-full">
      <FamilyForm
        familie={listFamily as any}
        dependents={(listFamily as any)?.dependents}
        periodBenefit={(listFamily as any)?.periodBenefit}
        userId={userId}
      />
    </div>
  )
}
