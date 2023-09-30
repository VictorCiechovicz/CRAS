'use client'

import { useState } from 'react'
import { Table } from '@/src/components/common'
import { columns } from './columns'
import { FamilyList } from '@/src/schemas'

interface FamilyListProps {
  items: FamilyList[]
}

export function FamilyList({ items }: FamilyListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  return (
    <Table
      title="Famílias"
      columns={columns}
      data={items}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={newPage => setCurrentPage(newPage)}
      onPageSizeChange={newSize => setPageSize(newSize)}
    />
  )
}
