'use client'

import { useState } from 'react'
import { Table } from '@/src/components/common'
import { columns } from './columns'
import { FamilyList } from '@/src/schemas'
import { UserGroupIcon, UserIcon } from '@heroicons/react/24/outline'
import FamilyDetailsModal from '@/src/components/common/Modal/ModalDetails'
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

  return (
    <div>
      <div className="bg-white rounded-lg px-12 py-7 mb-7 flex gap-14">
        <div className="flex gap-5">
          <div className="bg-green-200 w-20 h-20 rounded-full flex justify-center items-center">
            <UserGroupIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="flex flex-col justify-start gap-1">
            <p className="text-sm font-normal ">Famílias Cadastradas</p>
            <p className="text-2xl font-bold ">
              {items.length.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
        <div className="border-l " />
        <div className="flex gap-5">
          <div className="bg-green-200 w-20 h-20 rounded-full flex justify-center items-center">
            <UserIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="flex flex-col justify-start gap-1">
            <p className="text-sm font-normal ">Agentes Cadastradas</p>
            <p className="text-2xl font-bold ">
              {items.length.toLocaleString('pt-BR')}
            </p>
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
        data={items}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={newPage => setCurrentPage(newPage)}
        onPageSizeChange={newSize => setPageSize(newSize)}
        onRowClick={item => openModal(item)}
      />
    </div>
  )
}
