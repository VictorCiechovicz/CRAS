'use client'

import { useState } from 'react'
import { PageHeading, Table } from '@/components/common'
import { columns } from './columns'
import { HomeList } from '@/schemas'
import { Button } from '@/components/ui/button'

interface FamilyLisProps {
  items: HomeList[]
}

export function ManagementFamilyList({ items }: FamilyLisProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  return (
    <>
      <PageHeading
        title="Gestão de Famílias"
        paths={[
          { href: '/home', name: 'Início' },
          { href: '#', name: 'Gestão de Famílias' }
        ]}
      >
        <Button variant="outline" className="bg-blue-800 text-white rounded-lg">
          Nova Família
        </Button>
      </PageHeading>
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
