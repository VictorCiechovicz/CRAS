'use client'

import axios from 'axios'
import { Column } from '@/src/components/common/Table/types'
import { FamilyList } from '@/src/schemas'
import { formatPhoneNumber } from '@/src/utils/format/formatPhone'
import { formatStatus } from '@/src/utils/format/status'
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Tooltip } from 'react-tooltip'
import { Button, Modal } from '@/src/components/common'
import { useState } from 'react'

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
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false)
  const [typeUpdate, setTypeUpdate] = useState('')

  const handleUpdateStatus = async (status: string) => {
    await axios
      .put(`/api/approved/${rowData.id}`, { status })
      .then(() => {
        toast({
          title: 'Família Aceita',
          description: 'Família atualizada com sucesso!',
          variant: 'default'
        })
      })
      .catch(() => {
        toast({
          title: 'Família Não Aceita',
          description: 'Não foi possível atualizar a família!',
          variant: 'destructive'
        })
      })
      .finally(() => {
        setIsModalConfirmOpen(false)
        router.refresh()
      })
  }

  return (
    <div className="flex space-x-4">
      <Modal
        isOpen={isModalConfirmOpen}
        onClose={() => setIsModalConfirmOpen(false)}
        isCloseButton={false}
      >
        <div>
          <div className="flex justify-center pb-10">
            <p className="text-xl font-bold">
              Deseja{' '}
              {typeUpdate === 'ACTIVE'
                ? 'Aprovar o cadastro desta Família?'
                : 'Reprovar o cadastro desta Família?'}{' '}
            </p>
          </div>

          <div className="flex justify-center gap-2  ">
            <Button
              className="w-40"
              variant={'outline'}
              onClick={event => {
                event.stopPropagation(), setIsModalConfirmOpen(false)
              }}
            >
             Cancelar
            </Button>
            <Button
              className="bg-blue-800 w-40"
              onClick={event => {
                event.stopPropagation(), handleUpdateStatus(typeUpdate)
              }}
            >
              Sim
            </Button>
          </div>
        </div>
      </Modal>
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
      label: 'Renda Percapta',
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
