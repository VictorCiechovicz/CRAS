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
    <Modal isOpen={isOpen} onClose={onClose} >
      <div >
        <div className="flex justify-between items-center pb-10">
          <div className="flex gap-3">
            <div>{formatStatus(family?.status)}</div>
            <p className="text-2xl font-semibold whitespace-nowrap">
              Detalhes da Família
            </p>
          </div>
          <div>
            <p className="text-xs font-normal whitespace-nowrap">
              Criada em{' '}
              {family?.createdAt
                ? new Date(family.createdAt).toLocaleDateString('pt-BR') +
                  ' às ' +
                  new Date(family.createdAt).toLocaleTimeString('pt-BR')
                : ''}
            </p>
          </div>
        </div>

        <div>
          <div className="border rounded-sm mb-4">
            <div className="bg-gray-100 p-2">
              <p>Dados Responsável</p>
            </div>
            <div className="p-2 gap-2  flex-wrap">
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Nome:</p> {family?.name}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">CPF:</p> {family?.CPF}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">RG:</p> {family?.RG}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Data Nascimento:</p>
                {format(new Date(family?.date_birth_responsible), 'dd/MM/yyyy')}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Profissão:</p>
                {family?.profession_responsible}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">NIS:</p>
                {family?.nis_responsible}
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
                    <TableHead>Estado Civil</TableHead>
                    <TableHead>Profissão</TableHead>
                    <TableHead>Parentesco</TableHead>
                    <TableHead>Escolaridade</TableHead>
                    <TableHead>Renda</TableHead>
                    <TableHead>Tipo de Renda</TableHead>
                    <TableHead>NIS</TableHead>
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
                        <TableCell>{item.maritial_status_dependent}</TableCell>
                        <TableCell>{item.profession_dependent}</TableCell>
                        <TableCell>{item.kinship_dependent}</TableCell>
                        <TableCell>{item.schooling_dependent}</TableCell>
                        <TableCell>{item.income_dependent}</TableCell>
                        <TableCell>{item.type_income_dependent}</TableCell>
                        <TableCell>{item.nis_dependent}</TableCell>
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
              <p>Residência</p>
            </div>
            <div className="p-2">
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Tipo:</p> {family?.type_residence}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Possui Banheiro:</p>
                {family?.is_bathroom}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Casa de:</p>
                {family?.type_house}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Tempo de Moradia:</p>
                {family?.length_of_residence}
              </div>
            </div>
          </div>

          <div className="border rounded-sm mb-4">
            <div className="bg-gray-100 p-2">
              <p>Benefícios</p>
            </div>
            <div className="p-2">
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Possui Bolsa Família:</p>{' '}
                {family?.is_bolsa_familia}
              </div>
              {family?.value_bolsa_familia && (
                <div className="pb-1 flex gap-1">
                  <p className="font-semibold">Valor Bolsa Família:</p>
                  {family?.value_bolsa_familia}
                </div>
              )}

              <div className="pb-1 flex gap-1">
                <p className="font-semibold">BPC:</p>
                {family?.BPC}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">
                  Inserido em algum Programa da Assistência Social:
                </p>
                {family?.social_assistance_program}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Possui Cadastro Único:</p>
                {family?.is_single_cadastre}
              </div>
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
          {family?.notes && (
            <div className="border rounded-sm">
              <div className="bg-gray-100 p-2">
                <p>Anotações</p>
              </div>
              <div className="p-2">{family?.notes}</div>
            </div>
          )}
          {family?.notes_reprove && (
            <div className="border rounded-sm">
              <div className="bg-gray-100 p-2">
                <p>Motivo de Reprovação</p>
              </div>
              <div className="p-2">{family?.notes_reprove}</div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default FamilyDetailsModal
