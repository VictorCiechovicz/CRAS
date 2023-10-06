import getFamilyDetails from '@/src/app/actions/getFamilyDetails'
import { FamilyForm } from '@/src/components/page'
import axios from 'axios'

interface EditFamilyProps {
  params: {
    id: string
    familyId: string
  }
}

export default async function EditFamily({ params }: EditFamilyProps) {
  const familyId = params.familyId
  const userId = params.id
  const familyDetails = await getFamilyDetails({ familyId })

  return (
    <div className="w-full">
      <FamilyForm
        familie={familyDetails as any}
        dependents={(familyDetails as any)?.dependents}
        periodBenefit={(familyDetails as any)?.periodBenefit}
        userId={userId}
      />
    </div>
  )
}
