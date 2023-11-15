'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { format, isValid } from 'date-fns'

import { useForm } from 'react-hook-form'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PageHeading,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TabeBase,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  useToast
} from '@/src/components/common'

import states from '../../../utils/states'
import { Dependent, Familys, PeriodBenefit } from '@prisma/client'
import { FormData, TableBenefitPeriod, TableCompositionsFamily } from './types'
import { z } from 'zod'
import useLoading from '@/src/hook/useLoading'

import { useSession } from 'next-auth/react'
import { validateCPF } from '@/src/utils/validateCPF'
import { DatePicker } from '../../common/DatePicker'
import Loading from '../../common/Loading'
import MultiSelect from '../../common/ui/multiSelect'
import {
  formatCEP,
  formatCPF,
  formatMoney,
  formatPhoneNumber
} from '@/src/utils/format/masks'

export type FormValues = z.infer<typeof FormSchema>

export const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Informe o Nome Completo do representante da Família.'
    })

    .min(1, {
      message: 'Nome muito curto.'
    })
    .max(30, {
      message: 'Nome com numero máximo de 30 caracteres.'
    }),
  CPF: z
    .string({
      required_error: 'Informe CPF do Responsável da Família.'
    })
    .refine(data => validateCPF(data), {
      message: 'CPF inválido.'
    }),
  RG: z
    .string({
      required_error: 'Informe RG do Responsável da Família.'
    })
    .min(1, {
      message: 'RG muito curto.'
    }),
  date_birth_responsible: z.date({
    required_error: 'Informe Data de Nascimento do Responsável da Família.'
  }),
  profession_responsible: z.string({
    required_error: 'Informe Profissáo.'
  }),
  nis_responsible: z.string().default(''),
  type_residence: z.string({
    required_error: 'Informe Tipo de Residência.'
  }),
  is_bathroom: z.string({
    required_error: 'Informe se possui banheiro.'
  }),
  type_house: z.string({
    required_error: 'Informe Tipo da Casa.'
  }),
  length_of_residence: z.string({
    required_error: 'Informe Tempo de Moradia.'
  }),
  is_bolsa_familia: z.string({
    required_error: 'Informe se possuí Bolsa Família.'
  }),
  value_bolsa_familia: z.string().default(''),
  BPC: z.string({
    required_error: 'Informe se possuí BPC.'
  }),
  social_assistance_program: z.string({
    required_error: 'Informe se possuí algum Programa da Assistência Social.'
  }),
  is_single_cadastre: z.string({
    required_error: 'Informe se possuí Cadastro Único.'
  }),
  phone: z.string({
    required_error: 'Informe Celular.'
  }),
  city: z.string({
    required_error: 'Informe Cidade.'
  }),

  neighborhood: z.string({
    required_error: 'Informe a Bairro.'
  }),

  number: z.string({
    required_error: 'Informe Número.'
  }),

  state: z.string({
    required_error: 'Informe Estado.'
  }),

  street: z.string({
    required_error: 'Informe Rua.'
  }),

  zip_code: z.string({
    required_error: 'Informe CEP.'
  }),
  notes: z.string().nullable().default(''),
  notes_reprove: z.string().nullable().default(''),
  date_visited: z.date({
    required_error: 'Informe Data da Visita.'
  }),
  schooling_responsible: z.string({
    required_error: 'Informe Escolaridade.'
  }),
  income_responsible: z.string({
    required_error: 'Informe a Renda.'
  }),
  type_income_responsible: z
    .array(
      z.string({
        required_error: 'Informe Tipo de Renda.'
      })
    )
    .min(1, 'Selecione pelo menos uma opção de renda.')
})

interface FamilyFormProps {
  familie?: Familys
  dependents?: Dependent[]
  periodBenefit?: PeriodBenefit[]
  userId?: string
}

export function FamilyForm({
  familie,
  dependents,
  periodBenefit,
  userId
}: FamilyFormProps) {
  const [nameDependent, setNameDependent] = useState('')
  const [CPFDependent, setCPFDependent] = useState('')
  const [dateBirthDependent, setDateBirthDependent] = useState<
    Date | undefined
  >(undefined)
  const [maritialStatusDependent, setMaritialStatusDependent] = useState('')
  const [professionDependent, setProfessionDependent] = useState('')
  const [kinshipDependent, setKinshipDependent] = useState('')
  const [schoolingDependent, setSchoolingDependent] = useState('')
  const [incomeDependent, setIncomeDependent] = useState('')
  const [typeIncomeDependent, setTypeIncomeDependent] = useState<string[]>([])
  const [nisDependent, setNisDependent] = useState('')

  const [dateStartBenefit, setDateStartBenefit] = useState<Date | undefined>(
    undefined
  )
  const [dateEndBenefit, setDateEndBenefit] = useState<Date | undefined>(
    undefined
  )
  const [tableCompositionsFamily, setTableCompositionsFamily] = useState<
    TableCompositionsFamily[]
  >(dependents ? dependents : [])

  const [tableBenefitPeriod, setTableBenefitPeriod] = useState<
    TableBenefitPeriod[]
  >(periodBenefit ? periodBenefit : [])

  const [selectedState, setSelectedState] = useState(
    familie?.state && familie?.state
  )
  const [citys, setCitys] = useState<{ id: number; nome: string }[]>([])
  const [isRevision, setIsRevision] = useState(false)

  const defaultValues: Partial<FormValues> = {
    name: familie?.name,
    number: familie?.number,
    CPF: familie?.CPF,
    RG: familie?.RG,
    date_birth_responsible: familie?.date_birth_responsible
      ? new Date(familie?.date_birth_responsible)
      : undefined,
    profession_responsible: familie?.profession_responsible,
    nis_responsible: familie?.nis_responsible ? familie?.nis_responsible : '',
    phone: familie?.phone,
    city: familie?.city,
    neighborhood: familie?.neighborhood,
    state: familie?.state,
    street: familie?.street,
    zip_code: familie?.zip_code,
    notes: familie?.notes,
    type_residence: familie?.type_residence,
    is_bathroom: familie?.is_bathroom,
    type_house: familie?.type_house,
    length_of_residence: familie?.length_of_residence,
    is_bolsa_familia: familie?.is_bolsa_familia,
    value_bolsa_familia: familie?.value_bolsa_familia
      ? familie?.value_bolsa_familia
      : '',
    BPC: familie?.BPC,
    social_assistance_program: familie?.social_assistance_program,
    is_single_cadastre: familie?.is_single_cadastre,
    notes_reprove: familie?.notes_reprove,
    date_visited: familie?.date_visited
      ? new Date(familie?.date_visited)
      : undefined,
    schooling_responsible: familie?.schooling_responsible,
    income_responsible: familie?.income_responsible,
    type_income_responsible: Array.isArray(familie?.type_income_responsible)
      ? familie?.type_income_responsible
      : familie?.type_income_responsible
      ? [familie?.type_income_responsible]
      : []
  }

  const session = useSession()

  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues
  })
  const { toast } = useToast()
  const { isLoading, showLoading, stopLoading } = useLoading()

  const addToTableCompositionsFamily = () => {
    if (
      !nameDependent ||
      !CPFDependent ||
      !dateBirthDependent ||
      !maritialStatusDependent ||
      !professionDependent ||
      !kinshipDependent ||
      !schoolingDependent ||
      !typeIncomeDependent
    ) {
      return toast({
        title: 'Composição Familiar',
        variant: 'destructive',
        description: 'Informe as Informações do Componente Familiar'
      })
    }
    setTableCompositionsFamily((prevItems: any) => [
      ...prevItems,
      {
        name_dependent: nameDependent,
        CPF_dependent: CPFDependent,
        date_birth_dependent: dateBirthDependent,
        maritial_status_dependent: maritialStatusDependent,
        profession_dependent: professionDependent,
        kinship_dependent: kinshipDependent,
        schooling_dependent: schoolingDependent,
        income_dependent: incomeDependent,
        type_income_dependent: typeIncomeDependent,
        nis_dependent: nisDependent
      }
    ])

    setNameDependent('')
    setCPFDependent('')
    setDateBirthDependent(undefined)
    setMaritialStatusDependent('')
    setProfessionDependent('')
    setKinshipDependent('')
    setSchoolingDependent('')
    setIncomeDependent('')
    setTypeIncomeDependent([])
    setNisDependent('')
  }

  const deleteComposition = async (value: Dependent) => {
    try {
      await axios.delete(`/api/dependent/${value.id}`)
      toast({
        title: 'Dependente Familiar removido',
        description: 'Dependente Familiar Removido com Sucesso!',
        variant: 'default'
      })
    } catch (error) {
      console.error('Erro ao deletar o dependente familiar:', error)
      toast({
        title: 'Dependente Familiar não removido',
        description: 'Não foi Possível deletar o Dependente Familiar!',
        variant: 'destructive'
      })
    }
  }

  const removeFromTableCompositionsFamily = async (
    value: any,
    index: number
  ) => {
    showLoading()
    try {
      if (value.id) {
        await deleteComposition(value)
      }

      setTableCompositionsFamily(prevItems => {
        const newItems = [...prevItems]
        newItems.splice(index, 1)
        return newItems
      })
    } catch (error) {
      console.error('Não foi possível deletar o item', error)
    }
    stopLoading()
  }

  const addToTablePeriodBenefit = () => {
    if (!dateStartBenefit || !dateEndBenefit) {
      return toast({
        title: ' Períodos de Benefício',
        variant: 'destructive',
        description: 'Informe as Datas do Períodos de Benefício'
      })
    }

    if (dateStartBenefit > dateEndBenefit) {
      return toast({
        title: ' Períodos de Benefício',
        variant: 'destructive',
        description: 'Data de Entrada maior que Data de Entrada '
      })
    }

    setTableBenefitPeriod((prevItems: any) => [
      ...prevItems,
      {
        startDate: dateStartBenefit,
        endDate: dateEndBenefit
      }
    ])

    setDateStartBenefit(undefined)
    setDateEndBenefit(undefined)
  }

  const deletePeriodBenefit = async (value: PeriodBenefit) => {
    try {
      await axios.delete(`/api/periodBenefit/${value.id}`)
      toast({
        title: 'Período de Benefício removido',
        description: 'Período de Benefício removido com Sucesso!',
        variant: 'default'
      })
    } catch (error) {
      console.error('Erro ao deletar o Período de benefício:', error)
      toast({
        title: 'Período de Benefício não removido',
        description: 'Não foi Possível Deletar o Período de Benefício!',
        variant: 'destructive'
      })
    } finally {
      router.refresh()
    }
  }

  const removeFromTablePeridBenefit = async (value: any, index: number) => {
    showLoading()
    try {
      if (value.id) {
        await deletePeriodBenefit(value)
      }
      setTableBenefitPeriod(prevItems => {
        const newItems = [...prevItems]
        newItems.splice(index, 1)
        return newItems
      })
    } catch (error) {
      console.error('Não foi possível deletar o item', error)
    }
    stopLoading()
  }

  const handleUpdateFamily = async (data: Familys) => {
    try {
      const dataUpdate = {
        ...data
      }

      const response = await axios.put(
        `/api/familys/${familie?.id}`,
        dataUpdate
      )

      toast({
        title: isRevision ? 'Revisão de Família' : 'Atualização de Família',
        description: isRevision
          ? 'Família Enviada para Revisão com Sucesso!'
          : 'Família Atualizada com Sucesso!',
        variant: 'default'
      })

      return response.data
    } catch (error) {
      console.error('Erro ao atualizar a família:', error)

      toast({
        title: 'Revisão de Família',
        description: isRevision
          ? 'Não foi Possível enviar para Revisão a Família!'
          : 'Não foi Possível Atualizar a Família!',
        variant: 'destructive'
      })
    } finally {
      router.push(`/managementFamily/${userId}`)
      setTimeout(() => {
        router.refresh()
      }, 2000)
    }
  }

  const onSubmit = async (
    data: FormData,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const info = {
      ...data,
      createdByUserId: (session?.data?.user as any)?.id,
      createdByUserName: session?.data?.user?.name,
      dependents: tableCompositionsFamily,
      periodBenefit: tableBenefitPeriod,
      notes: data.notes,
      notes_reprove: ''
    }
    showLoading()
    try {
      if (familie && familie.id) {
        await handleUpdateFamily({
          ...info,
          createdByUserId: familie.createdByUserId,
          createdByUserName: familie.createdByUserName,
          status: isRevision ? 'PENDING' : familie.status,
          createdAt: familie.createdAt
        })
      } else {
        await axios.post('/api/familys', info)
        toast({
          title: 'Cadastro de Família',
          description: 'Família Cadastrada com Sucesso!',
          variant: 'default'
        })

        router.push(`/managementFamily/${userId}`)
        router.refresh()
      }
    } catch (error) {
      console.error('Erro ao Cadastrada a Família:', error)

      toast({
        title: 'Cadastro de Família',
        description: 'Não foi Possível Cadastrada a Família!',
        variant: 'destructive'
      })
    } finally {
      stopLoading()
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`
        )
        setCitys(response.data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetch()
  }, [selectedState])

  const handlePhoneChange = (event: any) => {
    const formattedPhone = formatPhoneNumber(event.target.value)
    form.setValue('phone', formattedPhone)
  }

  const handleCepChange = (event: any) => {
    const formattedCep = formatCEP(event.target.value)
    form.setValue('zip_code', formattedCep)
  }

  const handleMoneyResponsibleChange = (event: any) => {
    const formattedMoney = formatMoney(event.target.value)
    form.setValue('income_responsible', formattedMoney)
  }

  const handleMoneyBolsaFamiliaChange = (event: any) => {
    const formattedMoney = formatMoney(event.target.value)
    form.setValue('value_bolsa_familia', formattedMoney)
  }

  const handleMoneyDependentChange = (event: any) => {
    const formattedMoney = formatMoney(event.target.value)
    setIncomeDependent(formattedMoney)
  }

  const handleCPFChange = (event: any) => {
    const formattedCPF = formatCPF(event.target.value)
    form.setValue('CPF', formattedCPF)
  }
  const handleCPFDependentChange = (event: any) => {
    const formattedCPF = formatCPF(event.target.value)
    setCPFDependent(formattedCPF)
  }

  return (
    <div>
      <PageHeading
        title="Gestão de Famílias"
        paths={[
          { href: '/home', name: 'Início' },
          { href: `/managementFamily/${userId}`, name: 'Gestão de Famílias' },
          { href: '#', name: 'Cadastro de Família' }
        ]}
      />

      <div className=" mb-5 pb-5 "></div>
      {isLoading && <Loading status={isLoading} />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-8 flex flex-col items-center w-full"
        >
          <div className="w-full">
            <div className="border-t border-gray-300 pt-4 flex flex-col w-full">
              <h3 className="text-lg font-semibold text-gray-900 pb-4">
                Dados Responsável
              </h3>

              <div className="flex justify-center">
                <div className="flex gap-4 flex-wrap justify-start max-w-[956px]">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome Completo" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="CPF"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="CPF"
                            {...field}
                            onChange={handleCPFChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="RG"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>RG</FormLabel>
                        <FormControl>
                          <Input placeholder="RG" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="date_birth_responsible"
                    render={({ field }) => {
                      const validDate = isValid(new Date(field.value))
                        ? new Date(field.value)
                        : null

                      return (
                        <FormItem className="flex flex-col w-[308px]">
                          <FormLabel className="mb-2.5">
                            Data de Nascimento
                          </FormLabel>
                          <DatePicker
                            selected={validDate}
                            handleChangeDate={date => field.onChange(date)}
                            onChange={date => field.onChange(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholder="Selecione uma data"
                          />
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="profession_responsible"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Profissão</FormLabel>
                        <FormControl>
                          <Input placeholder="Profissão" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="schooling_responsible"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Escolaridade</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Fundamental-Incompleto">
                                Fundamental-Incompleto
                              </SelectItem>
                              <SelectItem value="Fundamental-Completo">
                                Fundamental-Completo
                              </SelectItem>
                              <SelectItem value="Médio-Incompleto">
                                Médio-Incompleto
                              </SelectItem>
                              <SelectItem value="Médio-Completo">
                                Médio-Completo
                              </SelectItem>
                              <SelectItem value="Superior">Superior</SelectItem>
                              <SelectItem value="Nenhuma">Nenhuma</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="income_responsible"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Renda</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Renda"
                            {...field}
                            onChange={handleMoneyResponsibleChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="type_income_responsible"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Tipo de Renda</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={[
                              { value: 'Formal', label: 'Formal' },
                              { value: 'Informal', label: 'Informal' },
                              {
                                value: 'Aposentadoria',
                                label: 'Aposentadoria'
                              },
                              { value: 'BPC', label: 'BPC' },
                              { value: 'Pensão', label: 'Pensão' },
                              {
                                value: 'Não Possui Renda',
                                label: 'Não Possui Renda'
                              }
                            ]}
                            selectedValues={field.value || []}
                            onChange={newValues => field.onChange(newValues)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nis_responsible"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>NIS</FormLabel>
                        <FormControl>
                          <Input placeholder="NIS" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Celular</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Celular"
                            {...field}
                            onChange={handlePhoneChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="border-t border-gray-300 pt-4 flex   flex-col">
              <h3 className="text-lg font-semibold text-gray-900 pb-4">
                Composição Familiar
              </h3>

              <div className="flex justify-center">
                <div className="flex gap-4 flex-wrap justify-start max-w-[956px]">
                  <FormField
                    name="name_dependent"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome"
                            value={nameDependent}
                            onChange={e => setNameDependent(e.target.value)}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="CPF_dependent"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="CPF"
                            value={CPFDependent}
                            onChange={handleCPFDependentChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="date_birth_dependent"
                    render={({ field }) => {
                      const validDate =
                        dateBirthDependent &&
                        isValid(new Date(dateBirthDependent))
                          ? new Date(dateBirthDependent)
                          : null

                      return (
                        <FormItem className="flex flex-col w-[308px]">
                          <FormLabel className="mb-2.5">
                            Data de Nascimento
                          </FormLabel>
                          <DatePicker
                            selected={validDate}
                            handleChangeDate={date => {
                              setDateBirthDependent(date ?? undefined)
                            }}
                            onChange={date => {
                              setDateBirthDependent(date ?? undefined)
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholder="Selecione uma data"
                            required={false}
                          />

                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />

                  <FormField
                    name="maritial_status_dependent"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Estado Civil</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              setMaritialStatusDependent(value)
                            }}
                            defaultValue={maritialStatusDependent}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Solteiro">Solteiro</SelectItem>
                              <SelectItem value="Namorando">
                                Namorando
                              </SelectItem>
                              <SelectItem value="Casado">Casado</SelectItem>
                              <SelectItem value="Separado">Separado</SelectItem>
                              <SelectItem value="Divorciado">
                                Divorciado
                              </SelectItem>
                              <SelectItem value="Viúvo">Viúvo</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="profession_dependent"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Profissão</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Profissão"
                            value={professionDependent}
                            onChange={e =>
                              setProfessionDependent(e.target.value)
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="kinship_dependent"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Parentesco</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              setKinshipDependent(value)
                            }}
                            defaultValue={kinshipDependent}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pessoa Responsável pela Unidade Familiar">
                                Pessoa Responsável pela Unidade Familiar
                              </SelectItem>
                              <SelectItem value="Cônjuge ou Companheiro(a)">
                                Cônjuge ou Companheiro(a)
                              </SelectItem>
                              <SelectItem value="Filho(a)">Filho(a)</SelectItem>
                              <SelectItem value="Enteado(a)">
                                Enteado(a)
                              </SelectItem>
                              <SelectItem value="Neto(a) ou Bisneto(a)">
                                Neto(a) ou Bisneto(a)
                              </SelectItem>
                              <SelectItem value="Pai ou Mãe">
                                Pai ou Mãe
                              </SelectItem>
                              <SelectItem value="Sogro(a)">Sogro(a)</SelectItem>
                              <SelectItem value="Irmão ou Irmã">
                                Irmão ou Irmã
                              </SelectItem>
                              <SelectItem value="Genro ou Nora">
                                Genro ou Nora
                              </SelectItem>
                              <SelectItem value="Outro Parente">
                                Outro Parente
                              </SelectItem>
                              <SelectItem value="Não Parente">
                                Não Parente
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="schooling_dependent"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Escolaridade</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              setSchoolingDependent(value)
                            }}
                            defaultValue={schoolingDependent}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Fundamental-Incompleto">
                                Fundamental-Incompleto
                              </SelectItem>
                              <SelectItem value="Fundamental-Completo">
                                Fundamental-Completo
                              </SelectItem>
                              <SelectItem value="Médio-Incompleto">
                                Médio-Incompleto
                              </SelectItem>
                              <SelectItem value="Médio-Completo">
                                Médio-Completo
                              </SelectItem>
                              <SelectItem value="Superior">Superior</SelectItem>
                              <SelectItem value="Nenhuma">Nenhuma</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="income_dependent"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Renda</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Renda"
                            value={incomeDependent}
                            onChange={handleMoneyDependentChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="type_income_dependent"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Tipo de Renda</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={[
                              { value: 'Formal', label: 'Formal' },
                              { value: 'Informal', label: 'Informal' },
                              {
                                value: 'Aposentadoria',
                                label: 'Aposentadoria'
                              },
                              { value: 'BPC', label: 'BPC' },
                              { value: 'Pensão', label: 'Pensão' },
                              {
                                value: 'Não Possui Renda',
                                label: 'Não Possui Renda'
                              }
                            ]}
                            selectedValues={typeIncomeDependent || []}
                            onChange={newValues =>
                              setTypeIncomeDependent(newValues)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="nis_dependent"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>NIS</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="NIS"
                            value={nisDependent}
                            onChange={e => setNisDependent(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end max-w-[1230px] ">
              <Button
                variant={'outline'}
                type="button"
                className="mt-10 mb-10 bg-blue-800 text-white "
                onClick={addToTableCompositionsFamily}
                disabled={
                  !nameDependent ||
                  !CPFDependent ||
                  !dateBirthDependent ||
                  !maritialStatusDependent ||
                  !professionDependent ||
                  !kinshipDependent ||
                  !schoolingDependent ||
                  !typeIncomeDependent
                }
              >
                Adicionar
              </Button>
            </div>
          </div>

          {tableCompositionsFamily?.length > 0 && (
            <div>
              <TabeBase className="bg-white rounded-sm">
                <TableHeader className="bg-gray-200 rounded-sm">
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
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableCompositionsFamily?.length > 0 ? (
                    tableCompositionsFamily?.map((item, index) => (
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
                        <TableCell>
                          {item.type_income_dependent.join(', ')}
                        </TableCell>
                        <TableCell>{item.nis_dependent}</TableCell>
                        <TableCell>
                          <Button
                            variant={'outline'}
                            type="button"
                            onClick={() =>
                              removeFromTableCompositionsFamily(item, index)
                            }
                            className="bg-red-600 text-white"
                          >
                            Remover
                          </Button>
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
          )}

          {familie && (
            <div className="w-full">
              <div className="border-t border-gray-300 pt-4 flex   flex-col">
                <h3 className="text-lg font-semibold text-gray-900 pb-4">
                  Períodos de Benefício
                </h3>

                <div>
                  <TabeBase className="bg-white rounded-sm">
                    <TableHeader className="bg-gray-200 rounded-sm">
                      <TableRow>
                        <TableHead>Data de Entrada</TableHead>
                        <TableHead>Data de Saída</TableHead>
                        <TableHead>Data de Retirada</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableBenefitPeriod?.length > 0 ? (
                        tableBenefitPeriod?.map((item, index) => (
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

                            <TableCell>
                              {item.withdrawalBenefit &&
                              isValid(new Date(item.withdrawalBenefit))
                                ? format(
                                    new Date(item.withdrawalBenefit),
                                    'dd/MM/yyyy'
                                  )
                                : ''}
                            </TableCell>

                            <TableCell>
                              <Button
                                variant={'outline'}
                                type="button"
                                onClick={() =>
                                  removeFromTablePeridBenefit(item, index)
                                }
                                className="bg-red-600 text-white"
                              >
                                Remover
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5}>
                            Não há itens na tabela.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </TabeBase>
                </div>
              </div>
            </div>
          )}

          <div className="w-full">
            <div className="border-t border-gray-300 pt-4 flex   flex-col">
              <h3 className="text-lg font-semibold text-gray-900 pb-4">
                Residência
              </h3>

              <div className="flex justify-center">
                <div className="flex gap-4 flex-wrap justify-start max-w-[956px]">
                  <FormField
                    control={form.control}
                    name="type_residence"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Tipo</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Própria">Própria</SelectItem>
                              <SelectItem value="Alugada">Alugada</SelectItem>
                              <SelectItem value="Cedida">Cedida</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_bathroom"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Possui Banheiro</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sim">Sim</SelectItem>
                              <SelectItem value="Não">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type_house"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Casa de</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Madeira">Madeira</SelectItem>
                              <SelectItem value="Alvenaria">
                                Alvenaria
                              </SelectItem>
                              <SelectItem value="Mista">Mista</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="length_of_residence"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Tempo de Moradia</FormLabel>
                        <FormControl>
                          <Input placeholder="Tempo de Moradia" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="border-t border-gray-300 pt-4 flex   flex-col">
              <h3 className="text-lg font-semibold text-gray-900 pb-4">
                Benefícios
              </h3>
              <div className="flex justify-center">
                <div className="flex gap-4 flex-wrap justify-start max-w-[956px]">
                  <FormField
                    control={form.control}
                    name="is_bolsa_familia"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Possui Bolsa Família?</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sim">Sim</SelectItem>
                              <SelectItem value="Não">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="value_bolsa_familia"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Valor Bolsa Família</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Valor Bolsa Família"
                            {...field}
                            onChange={handleMoneyBolsaFamiliaChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="BPC"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>
                          BPC-Beneficio de Prestação Continuada
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sim">Sim</SelectItem>
                              <SelectItem value="Não">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="social_assistance_program"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel className="text-xs">
                          Inserido em algum Programa da Assistência Social
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sim">Sim</SelectItem>
                              <SelectItem value="Não">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_single_cadastre"
                    render={({ field }) => (
                      <FormItem className="w-[308px]">
                        <FormLabel>Possui Cadastro Único</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sim">Sim</SelectItem>
                              <SelectItem value="Não">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="border-t border-gray-300 pt-4 flex   flex-col">
              <h3 className="text-lg font-semibold text-gray-900 pb-4">
                Endereço
              </h3>
              <div className="flex justify-center">
                <div className="flex gap-4 flex-wrap justify-start max-w-[956px]">
                  <FormField
                    control={form.control}
                    name="zip_code"
                    render={({ field }) => (
                      <FormItem className="w-[232px]">
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="CEP"
                            {...field}
                            onChange={handleCepChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className="w-[320px]">
                        <FormLabel>Logradouro</FormLabel>
                        <FormControl>
                          <Input placeholder="Logradouro" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem className="w-[104px]">
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="Número" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem className="w-[250px]">
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Bairro" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="complement"
                    render={({ field }) => (
                      <FormItem className="w-[232px]">
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Complemento" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="w-[320px]">
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value)
                              setSelectedState(value)
                            }}
                            defaultValue={selectedState}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {states.map(state => (
                                <SelectItem value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-[370px]">
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {citys.map(city => (
                                <SelectItem value={city.nome}>
                                  {city.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="border-t border-gray-300 pt-4 flex   flex-col">
              <h3 className="text-lg font-semibold text-gray-900 pb-4">
                Anotações
              </h3>
              <div className="flex justify-center">
                <div className="flex gap-4 flex-wrap justify-start max-w-[956px]">
                  <FormField
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="w-[956px]">
                        <FormLabel>Anotações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Anotações"
                            maxLength={1000}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="border-t border-gray-300 pt-4 flex   flex-col">
              <h3 className="text-lg font-semibold text-gray-900 pb-4">
                Data da Visita
              </h3>
              <div className="flex justify-start pl-[276px]">
                <div className="flex max-w-[956px]">
                  <FormField
                    name="date_visited"
                    render={({ field }) => {
                      const validDate = isValid(new Date(field.value))
                        ? new Date(field.value)
                        : null

                      return (
                        <FormItem className=" w-[370px]">
                          <FormLabel className="mb-2.5">
                            Data da Visita
                          </FormLabel>
                          <DatePicker
                            selected={validDate}
                            handleChangeDate={date => field.onChange(date)}
                            onChange={date => field.onChange(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholder="Selecione uma data"
                          />
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 w-full">
            <Button
              variant={'outline'}
              type="button"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            {familie && (
              <Button
                variant={'outline'}
                type="submit"
                onClick={() => {
                  setIsRevision(true)
                }}
                className="bg-yellow-300 text-white"
              >
                Enviar para Revisão
              </Button>
            )}

            <Button
              variant={'outline'}
              type="submit"
              className="bg-blue-800 text-white"
            >
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
