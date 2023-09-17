'use client'

import { useState } from 'react'
import { PageHeading, Table } from '@/components/common'
import { columns } from './columns'
import { HomeList } from '@/schemas'
import { Button } from '@/components/common/ui/button'
import { useRouter } from 'next/navigation'

interface ManagementAgentsProps {
  items: HomeList[]
}

export function ManagementAgentsList({ items }: ManagementAgentsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const router = useRouter()
  return (
    <>
      <PageHeading
        title="Gestão de Agentes"
        paths={[
          { href: '/home', name: 'Início' },
          { href: '#', name: 'Gestão de Agentes' }
        ]}
      >
        <Button
          variant="outline"
          className="bg-blue-800 text-white rounded-lg"
          onClick={() => router.push('/managementAgents/registerAgents')}
        >
          Novo Agente
        </Button>
      </PageHeading>
      <Table
        title="Agentes"
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
