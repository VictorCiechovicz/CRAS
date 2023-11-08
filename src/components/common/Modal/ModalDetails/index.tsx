'use client'

import {
  Modal,
  TabeBase,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
  Button,
  useToast
} from '@/src/components/common'
import { FamilyList } from '@/src/schemas'
import { formatStatus } from '@/src/utils/format/status'
import { format, isValid } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
import { DatePicker } from '../../DatePicker'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { PeriodBenefit } from '@prisma/client'

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
  const [isVisibleDateWithdrawalBenefit, setIsVisibleDateWithdrawalBenefit] =
    useState(false)
  const [dateWithdrawalBenefit, setDateWithdrawalBenefit] = useState<
    Date | undefined
  >(undefined)
  const [infosPeridBenefit, setInfosPeridBenefit] = useState<PeriodBenefit>()

  const { data: session } = useSession()
  const datePickerRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()
  const router = useRouter()

  const handleUpdateDateWithdrawalBenefit = async () => {
    if (infosPeridBenefit)
      try {
        const data = {
          withdrawalBenefit: dateWithdrawalBenefit
        }
        setIsVisibleDateWithdrawalBenefit(false)

        await axios.put(`/api/periodBenefit/${infosPeridBenefit.id}`, data)
        toast({
          title: 'Período de Benefício',
          description: 'Adicionado Data de Retirada do Benefício com sucesso!',
          variant: 'default'
        })
      } catch (error) {
        toast({
          title: 'Período de Benefício',
          description:
            'Não foi possivel adicionar Data de Retirada do Benefício!',
          variant: 'destructive'
        })
      } finally {
        router.refresh()
      }
  }

  useEffect(() => {
    if (family) {
      const incomeResp = family.income_responsible.trim() // Ajuste aqui se necessário
      const incomeRespValue =
        incomeResp && !isNaN(Number(incomeResp)) ? parseFloat(incomeResp) : 0

      const totalIncome = family.dependents
        .map(dep => {
          const income = dep.income_dependent.trim()
          return income && !isNaN(income) ? parseFloat(income) : 0
        })
        .reduce((acc, curr) => acc + curr, incomeRespValue)

      const familySize = family.dependents.length + 1
      const perCapitaIncome = totalIncome / (familySize || 1)

      const formattedIncome = perCapitaIncome.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })

      setTotalIncome(formattedIncome)
    }
  }, [family])

  const CustomInput = React.forwardRef((props: any, ref: any) => (
    <input
      className="border"
      onClick={props.onClick}
      value={props.value}
      ref={ref}
      readOnly
    />
  ))

  if (!family) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex justify-between items-center pb-10">
          <div className="flex  flex-col items-start">
            <div className="flex gap-3">
              <div>{formatStatus(family?.status)}</div>
              <p className="text-2xl font-semibold whitespace-nowrap">
                Detalhes da Família
              </p>
            </div>
            <div className="mt-3">
              <p className="text-base font-normal whitespace-nowrap">
                Data da Visita{' '}
                {family?.date_visited
                  ? new Date(family.date_visited).toLocaleDateString('pt-BR')
                  : ''}
              </p>
            </div>
          </div>
          <p className="text-xs font-normal whitespace-nowrap">
            Criada em{' '}
            {family?.createdAt
              ? new Date(family.createdAt).toLocaleDateString('pt-BR') +
                ' às ' +
                new Date(family.createdAt).toLocaleTimeString('pt-BR')
              : ''}
          </p>
        </div>

        <div>
          <div className="border rounded-sm mb-4">
            <div className="bg-gray-100 p-2 flex">
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
                <p className="font-semibold">Escolaridade:</p>
                {family?.schooling_responsible}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Renda:</p>
                {Number(family?.income_responsible).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Tipo de Renda:</p>
                {family?.type_income_responsible}
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
            <div className="bg-gray-100 p-2 flex">
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
                        <TableCell>
                          {Number(item.income_dependent).toLocaleString(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL'
                            }
                          )}
                        </TableCell>
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

          <div className="border rounded-sm mb-4 ">
            <div className="bg-gray-100 p-2 flex">
              <p>Períodos de Benefício</p>
            </div>

            <div className="p-2 ">
              <TabeBase className="bg-white border ">
                <TableHeader className="bg-gray-200 rounded-sm ">
                  <TableRow>
                    <TableHead>Data de Entrada</TableHead>
                    <TableHead>Data de Saída</TableHead>
                    <TableHead>Data de Retirada</TableHead>
                    {(session?.user as any)?.role === 'master' && (
                      <TableHead>Ações</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {family && family.periodBenefit.length > 0 ? (
                    family.periodBenefit.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex">
                            {isValid(new Date(item.startDate))
                              ? format(new Date(item.startDate), 'dd/MM/yyyy')
                              : 'Data inválida'}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex">
                            {isValid(new Date(item.endDate))
                              ? format(new Date(item.endDate), 'dd/MM/yyyy')
                              : 'Data inválida'}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Modal
                            isOpen={isVisibleDateWithdrawalBenefit}
                            onClose={() =>
                              setIsVisibleDateWithdrawalBenefit(false)
                            }
                          >
                            <div className="p-3">
                              <div className="flex justify-center pb-10">
                                <p className="text-xl font-bold">
                                  Informe Data de Entrega do Benefício
                                </p>
                              </div>

                              <div>
                                <div className="flex gap-4 mb-10 justify-center">
                                  <div>
                                    <p className="text-sm font-medium  ">
                                      Data de Entrega
                                    </p>

                                    <DatePicker
                                      customInput={
                                        <CustomInput ref={datePickerRef} />
                                      }
                                      selected={
                                        dateWithdrawalBenefit &&
                                        isValid(new Date(dateWithdrawalBenefit))
                                          ? new Date(dateWithdrawalBenefit)
                                          : null
                                      }
                                      handleChangeDate={date => {
                                        setDateWithdrawalBenefit(
                                          date ?? undefined
                                        )
                                      }}
                                      onChange={date => {
                                        setDateWithdrawalBenefit(
                                          date ?? undefined
                                        )
                                      }}
                                      dateFormat="dd/MM/yyyy"
                                      placeholder="Selecione uma data"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-center gap-2">
                                <Button
                                  className="w-40"
                                  variant="outline"
                                  onClick={event => {
                                    event.stopPropagation()
                                    setIsVisibleDateWithdrawalBenefit(false)
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  disabled={!dateWithdrawalBenefit}
                                  className="bg-blue-800 w-40"
                                  onClick={handleUpdateDateWithdrawalBenefit}
                                >
                                  Salvar
                                </Button>
                              </div>
                            </div>
                          </Modal>
                          <div className="flex">
                            {item.withdrawalBenefit &&
                            isValid(new Date(item.withdrawalBenefit))
                              ? format(
                                  new Date(item.withdrawalBenefit),
                                  'dd/MM/yyyy'
                                )
                              : ''}
                          </div>
                        </TableCell>
                        {(session?.user as any)?.role === 'master' &&
                          !item.withdrawalBenefit && (
                            <TableCell>
                              <Button
                                variant={'outline'}
                                type="button"
                                onClick={() => {
                                  setInfosPeridBenefit(item),
                                    setIsVisibleDateWithdrawalBenefit(
                                      prev => !prev
                                    )
                                }}
                                className="bg-blue-800 text-white"
                              >
                                Adicionar Retirada
                              </Button>
                            </TableCell>
                          )}
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
            <div className="bg-gray-100 p-2 flex">
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
            <div className="bg-gray-100 p-2 flex">
              <p>Benefícios</p>
            </div>
            <div className="p-2">
              <div className="pb-1 flex gap-1">
                <p className="font-semibold">Possui Bolsa Família:</p>{' '}
                {family?.is_bolsa_familia}
              </div>
              {family?.value_bolsa_familia &&
              Number(family?.value_bolsa_familia) > 0 ? (
                <div className="pb-1 flex gap-1">
                  <p className="font-semibold">Valor Bolsa Família:</p>
                  {Number(family?.value_bolsa_familia).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              ) : null}

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
            <div className="bg-gray-100 p-2 flex">
              <p>Endereço</p>
            </div>
            <div className="p-2 flex">
              <p>
                {family?.street}, {family?.number} - {family?.neighborhood},
                CEP: {family?.zip_code}, {family?.city}-
                {family?.state.toLocaleUpperCase()}
              </p>
            </div>
          </div>
          {family?.notes && (
            <div className="border rounded-sm">
              <div className="bg-gray-100 p-2 flex">
                <p>Anotações</p>
              </div>
              <div className="p-2 flex">{family?.notes}</div>
            </div>
          )}
          {family?.notes_reprove && (
            <div className="border rounded-sm">
              <div className="bg-gray-100 p-2 flex">
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
