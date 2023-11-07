'use client'

import { Column } from '@/src/components/common/Table/types'
import { FamilyList } from '@/src/schemas'
import { formatPhoneNumber } from '@/src/utils/format/formatPhone'
import { formatStatus } from '@/src/utils/format/status'
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Tooltip } from 'react-tooltip'

interface ActionButtonsProps {
  router: AppRouterInstance
  rowData: FamilyList
  toast: (props: {
    title: string
    description: string
    variant: 'destructive' | 'default'
  }) => void
  setIsModalConfirmOpen: (value: boolean) => void
  setTypeUpdate: (value: string) => void
  setFamilyId: (value: string) => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  rowData,
  setIsModalConfirmOpen,
  setTypeUpdate,
  setFamilyId
}) => {
  return (
    <div className="flex space-x-4">
      <div
        data-tooltip-id="tooltip-active"
        data-tooltip-content={'Aprovar'}
        data-tooltip-place="top"
      >
        <button
          onClick={event => {
            event.stopPropagation()
            setIsModalConfirmOpen(true)
            setTypeUpdate('ACTIVE')
            setFamilyId(rowData.id)
          }}
        >
          <Tooltip id="tooltip-active" />
          <CheckCircleIcon className="w-7 h-7 text-green-500" />
        </button>
      </div>
      <div
        data-tooltip-id="tooltip-inactive"
        data-tooltip-content={'Reprovar'}
        data-tooltip-place="top"
      >
        <button
          onClick={event => {
            event.stopPropagation()
            setIsModalConfirmOpen(true)
            setTypeUpdate('INACTIVE')
            setFamilyId(rowData.id)
          }}
        >
          <Tooltip id="tooltip-inactive" />
          <XCircleIcon className="w-7 h-7 text-red-500" />
        </button>
      </div>
    </div>
  )
}

export const columns = (
  router: AppRouterInstance,
  toast: (props: {
    title: string
    description: string
    variant: 'destructive' | 'default'
  }) => void,
  setIsModalConfirmOpen: (value: boolean) => void,
  setTypeUpdate: (value: string) => void,
  setFamilyId: (value: string) => void
) =>
  [
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
      label: 'Renda Percapta',
      field: 'income_dependent',
      renderCell(_, rowData) {
        const totalIncome = rowData.dependents
          .map(dep => {
            const income = dep.income_dependent.trim()
            return income && !isNaN(income) ? parseFloat(income) : 0
          })
          .reduce((acc, curr) => acc + curr, 0)

        const perCapitaIncome = totalIncome / (rowData.dependents.length || 1)

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
          const date = new Date(rowData.periodBenefit[0].startDate)
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
          const date = new Date(rowData.periodBenefit[0].endDate)
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
    },
    {
      label: 'Ações',
      field: 'actions',
      renderCell(_, rowData: FamilyList) {
        return (
          <ActionButtons
            router={router}
            rowData={rowData}
            toast={toast}
            setIsModalConfirmOpen={setIsModalConfirmOpen}
            setTypeUpdate={setTypeUpdate}
            setFamilyId={setFamilyId}
          />
        )
      }
    }
  ] as Column<FamilyList>[]
