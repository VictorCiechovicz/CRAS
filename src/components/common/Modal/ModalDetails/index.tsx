'use client'

import {
  Modal,
  TabeBase,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader
} from '@/src/components/common'
import { FamilyList } from '@/src/schemas'
import { formatStatus } from '@/src/utils/format/status'
import { format, isValid } from 'date-fns'
import React, { useEffect, useState } from 'react'

interface FamilyDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  family: FamilyList | null
}

const FamilyDetailsModal: React.FC<FamilyDetailsModalProps> = ({
  isOpen,
  onClose,
  family
}) => {
  const [totalIncome, setTotalIncome] = useState<string>('')

  useEffect(() => {
    if (family) {
      const totalIncome = family.dependents
        .map(dep => parseFloat(dep.income_dependent))
        .reduce((acc, curr) => acc + curr, 0)

      const perCapitaIncome = totalIncome / (family.dependents.length || 1)

      const formattedIncome = perCapitaIncome.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })

      setTotalIncome(formattedIncome)
    }
  }, [family])

  if (!family) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex justify-between items-center pb-10">
          <div className="flex gap-3">
            <div>{formatStatus(family?.status)}</div>
            <p className="text-2xl font-semibold whitespace-nowrap">
              Detalhes da Família
            </p>
          </div>
        </div>

        <div>
          <div className="border rounded-sm mb-4">
            <div className="bg-gray-100 p-2">
              <p>Dados de Pessoais</p>
            </div>
            <div className="p-2 flex gap-2 w-full">
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Nome:</p> {family?.name}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">CPF:</p> {family?.CPF}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">RG:</p> {family?.RG}
              </div>
            </div>
          </div>

          <div className="border rounded-sm mb-4">
            <div className="bg-gray-100 p-2 ">
              <p>Dados de Contato</p>
            </div>
            <div className="p-2 flex gap-2">
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Email:</p> {family?.email}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Celular:</p> {family?.phone}
              </div>
            </div>
          </div>

          <div className="border rounded-sm mb-4">
            <div className="bg-gray-100 p-2">
              <p>Composição Familiar</p>
            </div>
            <div className="p-2 ">
              <TabeBase className="bg-white border ">
                <TableHeader className="bg-gray-200 rounded-sm ">
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Data de Nascimento</TableHead>
                    <TableHead>Renda</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {family && family.dependents.length > 0 ? (
                    family.dependents.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name_dependent}</TableCell>
                        <TableCell>{item.CPF_dependent}</TableCell>
                        <TableCell>
                          {isValid(new Date(item.date_birth_dependent))
                            ? format(
                                new Date(item.date_birth_dependent),
                                'dd/MM/yyyy'
                              )
                            : 'Data inválida'}
                        </TableCell>
                        <TableCell>{item.income_dependent}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>Não há itens na tabela.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TabeBase>
            </div>
            <div className="p-2">
              <p className="pb-2">Renda Familiar</p>

              <div className=" bg-green-200 rounded-lg flex justify-center items-center p-2">
                <p className="font-normal text-xl whitespace-nowrap">
                  {totalIncome}
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-sm mb-4">
            <div className="bg-gray-100 p-2">
              <p>Períodos de Benefício</p>
            </div>
            <div className="p-2">
              <TabeBase className="bg-white rounded-sm">
                <TableHeader className="bg-gray-200 rounded-sm">
                  <TableRow>
                    <TableHead>Data de Entrada</TableHead>
                    <TableHead>Data de Saída</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {family && family.periodBenefit.length > 0 ? (
                    family.periodBenefit.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {isValid(new Date(item.startDate))
                            ? format(new Date(item.startDate), 'dd/MM/yyyy')
                            : 'Data inválida'}
                        </TableCell>

                        <TableCell>
                          {isValid(new Date(item.endDate))
                            ? format(new Date(item.endDate), 'dd/MM/yyyy')
                            : 'Data inválida'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>Não há itens na tabela.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TabeBase>
            </div>
          </div>

          <div className="border rounded-sm mb-4">
            <div className="bg-gray-100 p-2">
              <p>Endereço</p>
            </div>
            <div className="p-2">
              <p>
                {family?.street}, {family?.number} - {family?.neighborhood},
                CEP: {family?.zip_code}, {family?.city}-{family?.state}
              </p>
            </div>
          </div>

          <div className="border rounded-sm">
            <div className="bg-gray-100 p-2">
              <p>Anotações</p>
            </div>
            <div className="p-2">{family?.notes}</div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FamilyDetailsModal
