'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  PageHeading,
  Table,
  useToast
} from '@/src/components/common'
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
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FamilyList | null>(null)

 

  const openModalDetails = (item: FamilyList) => {
    setSelectedItem(item)
    setIsModalDetailsOpen(true)
  }

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const sortedItems = items.sort(
      (a, b) =>
        new Date(b.createdAt || '1970-01-01').getTime() -
        new Date(a.createdAt || '1970-01-01').getTime()
    )

    const pendingItems = sortedItems.filter(item => item.status === 'PENDING')
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
        isOpen={isModalDetailsOpen}
        onClose={() => setIsModalDetailsOpen(false)}
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
        onRowClick={item => openModalDetails(item)}
      />
    </>
  )
}
