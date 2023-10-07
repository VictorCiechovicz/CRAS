import { Familys, Dependent, PeriodBenefit } from "@prisma/client"

export interface FamilyList extends Familys {

  dependents: Dependents[]
  periodBenefit: PeriodBenefit[]


}

