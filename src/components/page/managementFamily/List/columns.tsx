'use client'

import { Column } from '@/src/components/common/Table/types'
import { FamilyList } from '@/src/schemas'
import { formatPhoneNumber } from '@/src/utils/format/formatPhone'
import { formatStatus } from '@/src/utils/format/status'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
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
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  router,
  rowData,
  toast
}) => {
  const handleEditClick = (event: any) => {
    event.stopPropagation()
    router.push(`${rowData.createdByUserId}/editFamily/${rowData.id}`)
  }

  const handleDeleteClick = async (event: any) => {
    event.stopPropagation()
    await axios
      .delete(`/api/familys/${rowData.id}`)
      .then(() => {
        toast({
          title: 'Familia Deletada',
          description: 'Familia deletada com sucesso!',
          variant: 'default'
        })
      })
      .catch(() =>
        toast({
          title: 'Erro',
          description: 'Não foi possível deletar a familia!',
          variant: 'destructive'
        })
      )
      .finally(() => {
        router.refresh()
      })
  }

  return (
    <div className="flex space-x-6">
      <div
        data-tooltip-id="tooltip-edit"
        data-tooltip-content={'Editar'}
        data-tooltip-place="top"
      >
        <button onClick={handleEditClick}>
          <Tooltip id="tooltip-edit" />
          <PencilIcon className="w-5 h-5" />
        </button>
      </div>
      <div
        data-tooltip-id="tooltip-delete"
        data-tooltip-content={'Excluir'}
        data-tooltip-place="top"
      >
        <button onClick={handleDeleteClick}>
          <Tooltip id="tooltip-delete" />
          <TrashIcon className="w-5 h-5" />
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
  }) => void
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
        return <ActionButtons router={router} rowData={rowData} toast={toast} />
      }
    }
  ] as Column<FamilyList>[]
