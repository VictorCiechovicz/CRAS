'use client'

import { useState } from 'react'
import { Modal, PageHeading, Table, useToast } from '@/src/components/common'
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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const openModal = () => {
    setIsModalOpen(true)
  }

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
          onClick={() => router.push('./managementFamily/registerFamily')}
        >
          Nova Família
        </Button>
      </PageHeading>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        dfsdfsdfsdfsdf
      </Modal>
      <Table
        title="Suas Famílias"
        emptyMessage="Nenhuma Família Cadastrada"
        columns={columns(router, toast)}
        data={items}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={newPage => setCurrentPage(newPage)}
        onPageSizeChange={newSize => setPageSize(newSize)}
        onRowClick={() => openModal()}
      />
    </>
  )
}
