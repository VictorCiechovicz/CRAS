'use client'

import { useState } from 'react'
import { PageHeading, Table, useToast } from '@/src/components/common'
import { columns } from './columns'
import { FamilyList } from '@/src/schemas'
import { Button } from '@/src/components/common/ui/button'
import { useRouter } from 'next/navigation'

import FamilyDetailsModal from '@/src/components/common/Modal/ModalDetails'

interface ManagementFamilyProps {
  items: FamilyList[]
  userId?: string
}

export function ManagementFamilyList({ items, userId }: ManagementFamilyProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FamilyList | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  const openModal = (item: FamilyList) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }
  const familiesDecret = items.sort(
    (a, b) =>
      new Date(b.createdAt || '1970-01-01').getTime() -
      new Date(a.createdAt || '1970-01-01').getTime()
  )
  return (
    <>
      <PageHeading
        title="Gestão de Famílias"
        paths={[
          { href: '/home', name: 'Início' },
          { href: '#', name: 'Gestão de Famílias' }
        ]}
      >
        <Button
          variant="outline"
          className="bg-blue-800 text-white"
          onClick={() =>
            router.push(`/managementFamily/${userId}/registerFamily`)
          }
        >
          Nova Família
        </Button>
      </PageHeading>

      <FamilyDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        family={selectedItem}
      />
      <Table
        title="Suas Famílias"
        emptyMessage="Nenhuma Família Cadastrada"
        columns={columns(router, toast)}
        data={familiesDecret}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={newPage => setCurrentPage(newPage)}
        onPageSizeChange={newSize => setPageSize(newSize)}
        onRowClick={item => openModal(item)}
      />
    </>
  )
}
