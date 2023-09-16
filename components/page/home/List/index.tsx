'use client'

import { useState } from 'react'
import { Table } from '@/components/common'
import { columns } from './columns'
import { HomeList } from '@/schemas'

interface FamilyListProps {
  items: HomeList[]
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
