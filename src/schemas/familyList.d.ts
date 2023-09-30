export interface FamilyList {
  id:string
  name: string
  CPF: string
  RG: string
  email: string
  phone: string
  city: string
  neighborhood: string
  number: string
  state: string
  street: string
  zip_code: string
  createdByUserId: string
  createdByUserName: string
  dependents: Dependents[]
  periodBenefit: PeriodBenefit[]
  notes?: string
  status: 'ACTIVE'|'INACTIVE'|'PENDING'
}

interface Dependents {
  name_dependent: string
  CPF_dependent: string
  date_birth_dependent: string
  income_dependent: string
}

interface PeriodBenefit {
  startDate: string
  endDate: string
}

