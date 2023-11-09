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
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Tooltip } from 'react-tooltip'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
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
  const pdfRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const CustomInput = React.forwardRef((props: any, ref: any) => (
    <input
      className="border"
      onClick={props.onClick}
      value={props.value}
      ref={ref}
      readOnly
    />
  ))

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

  const downloadFileDocument = () => {
    const input = pdfRef.current
    if (input)
      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4', true)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgX = (pdfWidth - imgWidth * ratio) / 2
        const imgY = 30
        pdf.addImage(
          imgData,
          'PNG',
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        )
        pdf.save(`Detalhes da Família - ${family?.id}`)
      })
  }

  useEffect(() => {
    if (family) {
      const incomeResp = family.income_responsible.trim()
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

  if (!family) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white border border-gray-300" ref={pdfRef}>
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
          <div className="flex gap-2">
            <p className="text-xs font-normal whitespace-nowrap">
              Criada em{' '}
              {family?.createdAt
                ? new Date(family.createdAt).toLocaleDateString('pt-BR') +
                  ' às ' +
                  new Date(family.createdAt).toLocaleTimeString('pt-BR')
                : ''}
            </p>
            <div className="cursor-pointer">
              <ArrowDownTrayIcon
                onClick={downloadFileDocument}
                className="btn btn-primary w-4 h-4"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Dados Responsável
            </h3>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Nome:</p>
                  <span>{family?.name}</span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">CPF:</p>
                  <span>{family?.CPF}</span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">RG:</p>
                  <span>{family?.RG}</span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Data Nascimento:</p>
                  <span>
                    {format(
                      new Date(family?.date_birth_responsible),
                      'dd/MM/yyyy'
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Profissão:</p>
                  <span>{family?.profession_responsible}</span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Escolaridade:</p>
                  <span>{family?.schooling_responsible}</span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Renda:</p>
                  <span>
                    {Number(family?.income_responsible).toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL'
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Tipo de Renda:</p>
                  <span>{family?.type_income_responsible.join(', ')}</span>
                </div>

                <div className="flex items-center">
                  <p className="font-semibold mr-2">NIS:</p>
                  <span>{family?.nis_responsible}</span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Celular:</p>
                  <span>{family?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Composição Familiar
            </h3>
            <div className="p-4">
              <TabeBase className="w-full bg-white  ">
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead className="px-4 py-2">Nome</TableHead>
                    <TableHead className="px-4 py-2">CPF</TableHead>
                    <TableHead className="px-4 py-2">
                      Data de Nascimento
                    </TableHead>
                    <TableHead className="px-4 py-2">Estado Civil</TableHead>
                    <TableHead className="px-4 py-2">Profissão</TableHead>
                    <TableHead className="px-4 py-2">Parentesco</TableHead>
                    <TableHead className="px-4 py-2">Escolaridade</TableHead>
                    <TableHead className="px-4 py-2">Renda</TableHead>
                    <TableHead className="px-4 py-2">Tipo de Renda</TableHead>
                    <TableHead className="px-4 py-2">NIS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {family && family.dependents.length > 0 ? (
                    family.dependents.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="px-4 py-2">
                          {item.name_dependent}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {item.CPF_dependent}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {isValid(new Date(item.date_birth_dependent))
                            ? format(
                                new Date(item.date_birth_dependent),
                                'dd/MM/yyyy'
                              )
                            : 'Data inválida'}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {item.maritial_status_dependent}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {item.profession_dependent}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {item.kinship_dependent}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {item.schooling_dependent}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {Number(item.income_dependent).toLocaleString(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL'
                            }
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {item.type_income_dependent}
                        </TableCell>
                        <TableCell className="px-4 py-2">
                          {item.nis_dependent}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="px-4 py-2 text-center">
                        Não há itens na tabela.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TabeBase>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Renda Familiar
            </h3>
            <div className="bg-green-200 flex justify-center items-center py-3">
              <p className="text-xl font-medium text-gray-800">{totalIncome}</p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Períodos de Benefício
            </h3>
            <div className="p-4">
              <TabeBase className="w-full bg-white">
                <TableHeader className="bg-gray-200">
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
                      <TableCell colSpan={4} className="px-4 py-2 text-center">
                        Não há itens na tabela.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TabeBase>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold text-gray-900">Residência</h3>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Tipo de Residência:</p>
                  <span>{family?.type_residence}</span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Possui Banheiro:</p>
                  <span> {family?.is_bathroom}</span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Casa de:</p>
                  <span>{family?.type_house}</span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Tempo de Moradia:</p>
                  <span>{family?.length_of_residence}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold text-gray-900">Benefícios</h3>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Possui Bolsa Família:</p>
                  <span> {family?.is_bolsa_familia}</span>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold mr-2">Possui Banheiro:</p>
                  <span> {family?.is_bathroom}</span>
                </div>

                {family?.value_bolsa_familia &&
                Number(family?.value_bolsa_familia) > 0 ? (
                  <div className="flex items-center">
                    <p className="font-semibold mr-2">Valor Bolsa Família:</p>
                    <span>
                      {Number(family?.value_bolsa_familia).toLocaleString(
                        'pt-BR',
                        {
                          style: 'currency',
                          currency: 'BRL'
                        }
                      )}
                    </span>
                  </div>
                ) : null}

                <div className="flex items-center">
                  <p className="font-semibold mr-2">BPC:</p>
                  <span>{family?.BPC}</span>
                </div>

                <div className="flex items-center">
                  <p className="font-semibold mr-2">
                    Inserido em algum Programa da Assistência Social:
                  </p>
                  <span>{family?.social_assistance_program}</span>
                </div>

                <div className="flex items-center">
                  <p className="font-semibold mr-2">Possui Cadastro Único:</p>
                  <span>{family?.is_single_cadastre}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
            <div className="p-4 bg-white">
              <div className="flex items-center">
                <p className="font-semibold mr-2">Endereço:</p>
                <span>
                  {family?.street}, {family?.number} - {family?.neighborhood},
                  CEP: {family?.zip_code}, {family?.city}-
                  {family?.state.toLocaleUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {family?.notes && (
            <div className="border-t border-gray-300 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">Anotações</h3>
              <div className="p-4 bg-white">
                <div className="flex items-center">
                  <span> {family?.notes}</span>
                </div>
              </div>
            </div>
          )}
          {family?.notes_reprove && (
            <div className="border-t border-gray-300 pt-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Motivo de Reprovação
              </h3>
              <div className="p-4 bg-red-200">
                <div className="flex items-center">
                  <span> {family?.notes_reprove}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default FamilyDetailsModal
