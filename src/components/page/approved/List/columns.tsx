'use client'


import axios from 'axios'
import { Column } from '@/src/components/common/Table/types'
import { FamilyList } from '@/src/schemas'
import { formatPhoneNumber } from '@/src/utils/format/formatPhone'
import { formatStatus } from '@/src/utils/format/status'
import { PencilIcon, TrashIcon,XCircleIcon,CheckCircleIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

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

  const handleUpdateStatus = async (status: string) => {  
  
    await axios
      .put(`/api/approved/${rowData.id}`, { status })
      .then(() => {
        toast({
          title: 'Família Aceita',
          description: 'Família atualizada com sucesso!',
          variant: 'default'
        });
      })
      .catch(() => {
        toast({
          title: 'Família Não Aceita',
          description: 'Não foi possível atualizar a família!',
          variant: 'destructive'
        });
      })
      .finally(() => {
        router.refresh();
      });
  }
  

  return (
    <div className="flex space-x-2">
      <button onClick={() => handleUpdateStatus("ACTIVE")} >  
        <CheckCircleIcon className="w-7 h-7 text-green-500" />
      </button>
      <button onClick={() => handleUpdateStatus("INACTIVE")} >
        <XCircleIcon className="w-7 h-7 text-red-500" />
      </button>
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
        return totalIncome.toLocaleString('pt-BR', {
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
