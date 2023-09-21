'use client'

import { useState } from 'react'
import { PageHeading, Table } from '@/src/components/common'
import { columns } from './columns'
import { FamilyList } from '@/src/schemas'
import { Button } from '@/src/components/common/ui/button'
import { useRouter } from 'next/navigation'

interface ManagementFamilyProps {
  items: FamilyList[]
}

export function ManagementFamilyList({ items }: ManagementFamilyProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const router = useRouter()

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
          className="bg-blue-800 text-white rounded-lg"
          onClick={() => router.push('./managementFamily/registerFamily')}
        >
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
