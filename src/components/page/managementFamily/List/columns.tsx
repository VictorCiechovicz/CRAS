'use client'

import { Column } from '@/src/components/common/Table/types'
import { FamilyList } from '@/src/schemas'
import { formatPhoneNumber } from '@/src/utils/format/formatPhone'
import { formatStatus } from '@/src/utils/format/status'

export const columns = [
  {
    label: 'Nome',
    field: 'name'
  },
  {
    label: 'Celular',
    field: 'phone',
   valueFormatter:formatPhoneNumber
  },
  {
    label: 'Email',
    field: 'email'
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
    label: 'Renda',
    field: 'income_dependent',
    renderCell(_, rowData: FamilyList) {
      const totalIncome = rowData.dependents
        .map(dep => parseFloat(dep.income_dependent))
        .reduce((acc, curr) => acc + curr, 0)
      return totalIncome.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    }
  },
  {
    label: 'Data Entrada',
    field: 'check_in_date'
  },
  {
    label: 'Data Saída',
    field: 'check_out_date'
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
