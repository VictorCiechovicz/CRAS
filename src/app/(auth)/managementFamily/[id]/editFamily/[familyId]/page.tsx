import { FamilyForm } from '@/src/components/page'
import axios from 'axios'

interface EditFamilyProps {
  params: {
    familyId: string
  }
}

export default async function EditFamily({ params }: EditFamilyProps) {
  const familyId = params.familyId
  const listFamily = await axios.get(
    `http://localhost:3000/api/familys/${familyId}`
  )

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
