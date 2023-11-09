

export interface TableCompositionsFamily {
  id: string
  name_dependent: string
  CPF_dependent: string
  date_birth_dependent: Date
  income_dependent: string
  maritial_status_dependent: string
  profession_dependent: string
  kinship_dependent: string
  schooling_dependent: string
  type_income_dependent: string[]
  nis_dependent: string
}

export interface TableBenefitPeriod {
  id: string
  startDate: Date
  endDate: Date
  withdrawalBenefit: Date | null;

}
export interface Dependents {
  name_dependent: string
  CPF_dependent: string
  date_birth_dependent: string
  income_dependent: number
}

export type FormData = FormValues & {
  createdByUserId: string
  createdByUserName: string
  dependents: Dependents[]
  benefitPeriod: TableBenefitPeriod[]
  notes?: string
}

