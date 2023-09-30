'use client'

import { useEffect, useState } from 'react'
import { PageHeading, Table, useToast } from '@/src/components/common'
import { columns } from './columns'
import { FamilyList } from '@/src/schemas'
import { useRouter } from 'next/navigation'

interface ApprovedListProps {
  items: FamilyList[]
}

export function ApprovedList({ items }: ApprovedListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filteredItems, setFilteredItems] = useState<FamilyList[]>([])

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
      <Table
        title="Famílias Pendentes "
        columns={columns(router, toast)}
        data={filteredItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={newPage => setCurrentPage(newPage)}
        onPageSizeChange={newSize => setPageSize(newSize)}
      />
    </>
  )
}
