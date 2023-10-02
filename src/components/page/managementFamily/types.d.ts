export type FormValues = z.infer<typeof FormSchema>

export interface TableCompositionsFamily {
  id: string
  name_dependent: string
  CPF_dependent: string
  date_birth_dependent: Date
  income_dependent: string

}

export interface TableBenefitPeriod {
  id: string
  startDate: Date
  endDate: Date

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

