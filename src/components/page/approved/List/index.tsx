'use client'

import { useEffect, useState } from 'react'
import { PageHeading, Table, useToast } from '@/src/components/common'
import { columns } from './columns'
import { FamilyList } from '@/src/schemas'
import { useRouter } from 'next/navigation'
import FamilyDetailsModal from '@/src/components/common/Modal/ModalDetails'
import ApprovedModal from '@/src/components/common/Modal/ModalApproved'
import axios from 'axios'
import useLoading from '@/src/hook/useLoading'
import Loading from '@/src/components/common/Loading'

interface ApprovedListProps {
  items: FamilyList[]
}

export function ApprovedList({ items }: ApprovedListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filteredItems, setFilteredItems] = useState<FamilyList[]>([])
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FamilyList | null>(null)
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false)
  const [typeUpdate, setTypeUpdate] = useState('')
  const [familyId, setFamilyId] = useState('')

  const [dateStartBenefit, setDateStartBenefit] = useState<Date | undefined>(
    undefined
  )
  const [dateEndBenefit, setDateEndBenefit] = useState<Date | undefined>(
    undefined
  )
  const [notesReprove, setNotesReprove] = useState('')

  const { toast } = useToast()
  const router = useRouter()
  const { isLoading, showLoading, stopLoading } = useLoading()

  const openModalDetails = (item: FamilyList) => {
    setSelectedItem(item)
    setIsModalDetailsOpen(true)
  }

  const handleUpdateStatus = async (status: string) => {
    showLoading()
    try {
      const data = {
        status,
        periodBenefit:
          typeUpdate !== 'INACTIVE'
            ? {
                startDate: dateStartBenefit,
                endDate: dateEndBenefit
              }
            : [],
        notes_reprove: typeUpdate === 'INACTIVE' ? notesReprove : ''
      }
      setIsModalConfirmOpen(false)
      await axios.put(`/api/approved/${familyId}`, data)
      toast({
        title:
          typeUpdate !== 'INACTIVE' ? 'Família Aprovada' : 'Família Reprovada',
        description:
          typeUpdate !== 'INACTIVE'
            ? 'Família Aprovada com Sucesso!'
            : 'Família Reprovada com Sucesso!',
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description:
          typeUpdate === 'INACTIVE'
            ? 'Não foi Possível Aprovar a Família!'
            : 'Não foi Possível Reprovar a Família!',
        variant: 'destructive'
      })
    } finally {
      setNotesReprove('')
      setDateStartBenefit(undefined)
      setDateEndBenefit(undefined)

      stopLoading()
      router.refresh()
    }
  }

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
      {isLoading && <Loading status={isLoading} />}
      <PageHeading
        title="Gestão de Aprovações"
        paths={[
          { href: '/home', name: 'Início' },
          { href: '#', name: 'Gestão de Aprovações' }
        ]}
      />

      <ApprovedModal
        isModalConfirmOpen={isModalConfirmOpen}
        setIsModalConfirmOpen={setIsModalConfirmOpen}
        typeUpdate={typeUpdate}
        handleUpdateStatus={handleUpdateStatus}
        dateStartBenefit={dateStartBenefit}
        setDateStartBenefit={setDateStartBenefit}
        dateEndBenefit={dateEndBenefit}
        setDateEndBenefit={setDateEndBenefit}
        notesReprove={notesReprove}
        setNotesReprove={setNotesReprove}
      />

      <FamilyDetailsModal
        isOpen={isModalDetailsOpen}
        onClose={() => setIsModalDetailsOpen(false)}
        family={selectedItem}
      />

      <Table
        title="Famílias Pendentes"
        columns={columns(
          router,
          toast,
          setIsModalConfirmOpen,
          setTypeUpdate,
          setFamilyId
        )}
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
