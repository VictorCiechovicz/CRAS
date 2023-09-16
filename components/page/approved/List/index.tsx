'use client'

import { useState } from 'react'
import { PageHeading, Table } from '@/components/common'
import { columns } from './columns'
import { HomeList } from '@/schemas'


interface ApprovedListProps {
  items: HomeList[]
}

export function ApprovedList({ items }: ApprovedListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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
        title="Famílias"
        columns={columns}
        data={items}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={newPage => setCurrentPage(newPage)}
        onPageSizeChange={newSize => setPageSize(newSize)}
      />
    </>
  )
}
