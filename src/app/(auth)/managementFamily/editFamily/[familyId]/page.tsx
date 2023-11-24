import { getFamilyDetails } from '@/src/app/(auth)/services/callApi'
import { FamilyForm } from '@/src/components/page'

interface EditFamilyProps {
  params: {
    familyId: string
  }
}

export default async function EditFamily({ params }: EditFamilyProps) {
  const familyId = params.familyId

  const listFamily = await getFamilyDetails(familyId)

  return (
    <div className="w-full">
      <FamilyForm
        familie={listFamily.data}
        dependents={listFamily.data.dependents}
        periodBenefit={listFamily.data.periodBenefit}
      />
    </div>
  )
}
