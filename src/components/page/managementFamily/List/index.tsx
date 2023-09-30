'use client'

import { useState } from 'react'
import {
  Modal,
  PageHeading,
  TabeBase,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast
} from '@/src/components/common'
import { columns } from './columns'
import { FamilyList } from '@/src/schemas'
import { Button } from '@/src/components/common/ui/button'
import { useRouter } from 'next/navigation'
import { formatStatus } from '@/src/utils/format/status'
import { format, isValid } from 'date-fns'
import FamilyDetailsModal from '@/src/components/common/Modal/ModalDetails'

interface ManagementFamilyProps {
  items: FamilyList[]
}

export function ManagementFamilyList({ items }: ManagementFamilyProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FamilyList | null>(null)
  const [totalIncome, setTotalIncome] = useState<string>('')

  const { toast } = useToast()
  const router = useRouter()

  const openModal = (item: FamilyList) => {
    setSelectedItem(item)
    setIsModalOpen(true)

    const totalIncome = item.dependents
      .map(dep => parseFloat(dep.income_dependent))
      .reduce((acc, curr) => acc + curr, 0)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })

    setTotalIncome(totalIncome)
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

     
      <FamilyDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        family={selectedItem} 
        totalIncome={totalIncome} 
      />
      <Table
        title="Suas Famílias"
        emptyMessage="Nenhuma Família Cadastrada"
        columns={columns(router, toast)}
        data={items}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={newPage => setCurrentPage(newPage)}
        onPageSizeChange={newSize => setPageSize(newSize)}
        onRowClick={item => openModal(item)}
      />
    </>
  )
}
