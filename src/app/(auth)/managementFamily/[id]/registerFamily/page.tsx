import { FamilyForm } from '@/src/components/page'

interface RegisterFamilyProps {
  params: {
    id: string
    familyId: string
  }
}

export default async function RegisterFamily({ params }: RegisterFamilyProps) {
  const userId = params.id

  return (
    <div className="w-full">
      <FamilyForm userId={userId} />
    </div>
  )
}
