'use client'

import { useEffect, useState } from 'react'
import { PageHeading, Table, useToast } from '@/src/components/common'
import { columns } from './columns'
import { FamilyList } from '@/src/schemas'
import { useRouter } from 'next/navigation'
import FamilyDetailsModal from '@/src/components/common/Modal/ModalDetails'

interface ApprovedListProps {
  items: FamilyList[]
}

export function ApprovedList({ items }: ApprovedListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filteredItems, setFilteredItems] = useState<FamilyList[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FamilyList | null>(null)

  const openModal = (item: FamilyList) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const pendingItems = items.filter(item => item.status === 'PENDING')
    setFilteredItems(pendingItems)
  }, [items])
  return (
    <>
      <PageHeading
        title="Gestão de Aprovações"
        paths={[
          { href: '/home', name: 'Início' },
          { href: '#', name: 'Gestão de Aprovações' }
        ]}
      />
      <FamilyDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        family={selectedItem}
      />

      <Table
        title="Famílias Pendentes "
        columns={columns(router, toast)}
        data={filteredItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={newPage => setCurrentPage(newPage)}
        onPageSizeChange={newSize => setPageSize(newSize)}
        onRowClick={item => openModal(item)}
      />
    </>
  )
}
