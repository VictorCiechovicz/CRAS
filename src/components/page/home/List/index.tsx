'use client'

import { useEffect, useState } from 'react'
import { Table } from '@/src/components/common'
import { columns } from './columns'
import { FamilyList } from '@/src/schemas'
import { UserGroupIcon, UserIcon } from '@heroicons/react/24/outline'
import FamilyDetailsModal from '@/src/components/common/Modal/ModalDetails'
import axios from 'axios'
interface FamilyListProps {
  items: FamilyList[]
}

export function FamilyList({ items }: FamilyListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FamilyList | null>(null)

  const openModal = (item: FamilyList) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const familiesActives = items.filter(familia => familia.status === 'ACTIVE')
  const familiesInactives = items.filter(
    familia => familia.status === 'INACTIVE'
  )

  const familiesDecret = items.sort(
    (a, b) =>
      new Date(b.createdAt || '1970-01-01').getTime() -
      new Date(a.createdAt || '1970-01-01').getTime()
  )

  useEffect(() => {
    const atualizarStatus = async () => {
      try {
        await axios.put('/api/updateStatus')
      } catch (error) {
        console.error('Erro ao atualizar o status das famílias:', error)
      }
    }

    atualizarStatus()
  }, [])

  return (
    <div>
      <div className="bg-white rounded-3xl px-40 py-7 mb-7 flex justify-around gap-14 shadow-md">
        <div className="flex gap-5">
          <div className="bg-green-200 w-20 h-20 rounded-full flex justify-center items-center ">
            <UserGroupIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="flex flex-col justify-start gap-1">
            <p className="text-base font-normal ">Famílias Cadastradas</p>
            <p className="text-2xl font-bold ">{items.length}</p>
          </div>
        </div>

        <div className="border-l " />
        <div className="flex gap-5">
          <div className="bg-green-200 w-20 h-20 rounded-full flex justify-center items-center">
            <UserGroupIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="flex flex-col justify-start gap-1">
            <p className="text-base font-normal ">Familias Ativas</p>
            <p className="text-2xl font-bold ">{familiesActives.length}</p>
          </div>
        </div>

        <div className="border-l " />
        <div className="flex gap-5">
          <div className="bg-red-200 w-20 h-20 rounded-full flex justify-center items-center">
            <UserGroupIcon className="w-10 h-10 text-red-600" />
          </div>
          <div className="flex flex-col justify-start gap-1">
            <p className="text-base font-normal ">Famílias Inativas</p>
            <p className="text-2xl font-bold ">{familiesInactives.length}</p>
          </div>
        </div>
      </div>
      <FamilyDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        family={selectedItem}
      />
      <Table
        title="Famílias Cadastradas"
        columns={columns}
        data={familiesDecret}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={newPage => setCurrentPage(newPage)}
        onPageSizeChange={newSize => setPageSize(newSize)}
        onRowClick={item => openModal(item)}
      />
    </div>
  )
}
