'use client'

import { Column } from '@/src/components/common/Table/types'
import { FamilyList } from '@/src/schemas'
import { formatPhoneNumber } from '@/src/utils/format/masks'
import { formatStatus } from '@/src/utils/format/status'
import { format } from 'date-fns'

export const columns = [
  {
    label: 'Nome',
    field: 'name'
  },
  {
    label: 'Celular',
    field: 'phone',
    valueFormatter: formatPhoneNumber
  },

  {
    label: 'Agente',
    field: 'createdByUserName'
  },
  {
    label: 'Membros',
    field: 'members_familie',
    cellClassName: 'text-center',
    renderCell(value, rowData: FamilyList) {
      return rowData.dependents.length
    }
  },
  {
    label: 'Renda Per Capta',
    field: 'income_dependent',
    renderCell(_, rowData) {
      const incomeResp = rowData.income_responsible
        .trim()
        .replace('.', '')
        .replace(',', '.')
      const incomeRespValue =
        incomeResp && !isNaN(Number(incomeResp)) ? parseFloat(incomeResp) : 0

      const totalIncome = rowData.dependents
        .map(dep => {
          const income = dep.income_dependent
            .trim()
            .replace('.', '')
            .replace(',', '.')
          return income && !isNaN(income) ? parseFloat(income) : 0
        })
        .reduce((acc, curr) => acc + curr, incomeRespValue)

      const familySize = rowData.dependents.length + 1
      const perCapitaIncome = totalIncome / (familySize || 1)

      return perCapitaIncome.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    }
  },
  {
    label: 'Data Entrada',
    field: 'startDate',
    renderCell(value, rowData: FamilyList) {
      if (rowData.periodBenefit.length > 0) {
        const sortedPeriods = rowData.periodBenefit.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        const mostRecentPeriod = sortedPeriods[0]

        const date = new Date(mostRecentPeriod.startDate)
        return format(date, 'dd/MM/yyyy')
      }
      return 'N/A'
    }
  },
  {
    label: 'Data Saída',
    field: 'endDate',
    renderCell(value, rowData: FamilyList) {
      if (rowData.periodBenefit.length > 0) {
        const sortedPeriods = rowData.periodBenefit.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        const mostRecentPeriod = sortedPeriods[0]

        const date = new Date(mostRecentPeriod.endDate)
        return format(date, 'dd/MM/yyyy')
      }
      return 'N/A'
    }
  },

  {
    label: 'Endereço',
    field: 'adress',
    renderCell(value, rowData: FamilyList) {
      return `${rowData.street}, ${rowData.number} - ${rowData.neighborhood}, CEP ${rowData.zip_code}`
    }
  },
  {
    label: 'Status',
    field: 'status',
    valueFormatter: formatStatus
  }
] as Column<FamilyList>[]
