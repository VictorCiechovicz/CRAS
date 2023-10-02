'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/src/lib/utils'
import { format, isValid } from 'date-fns'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PageHeading,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import {
  FormData,
  FormValues,
  TableBenefitPeriod,
  TableCompositionsFamily
} from './types'
import { z } from 'zod'
import useLoading from '@/src/hook/useLoading'
import Loading from '../../common/Loading'

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
  CPF: z.string({
    required_error: 'Informe CPF do representante da Família.'
  }),
  RG: z
    .string({
      required_error: 'Informe RG do representante da Família.'
    })
    .min(1, {
      message: 'RG muito curto.'
    })
    .max(8, {
      message: 'RG com numero máximo de 8 caracteres.'
    }),
  email: z
    .string({
      required_error: 'Informe Email do representante da Família.'
    })
    .email('Formato de Email inválido!'),
  phone: z.string({
    required_error: 'Informe Celular do representante da Família.'
  }),
  city: z.string({
    required_error: 'Informe Cidade da Família.'
  }),

  neighborhood: z.string({
    required_error: 'Informe a Bairro da Família.'
  }),

  number: z.string({
    required_error: 'Informe Número da Família.'
  }),

  state: z.string({
    required_error: 'Informe Estado da Família.'
  }),

  street: z.string({
    required_error: 'Informe Rua da Família.'
  }),

  zip_code: z.string({
    required_error: 'Informe CEP da Família.'
  })
})

interface FamilyFormProps {
  familie: Familys
  dependents?: Dependent[]
  periodBenefit?: PeriodBenefit[]
  userId?: string
}

interface dataEditFamily extends Familys {
  dependents: Dependent[]
  periodBenefit: PeriodBenefit[]
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
  const [incomeDependent, setIncomeDependent] = useState('')

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

  const defaultValues: Partial<FormValues> = {
    name: familie?.name,
    number: familie?.number,
    CPF: familie?.CPF,
    RG: familie?.RG,
    email: familie?.email,
    phone: familie?.phone,
    city: familie?.city,
    neighborhood: familie?.neighborhood,
    state: familie?.state,
    street: familie?.street,
    zip_code: familie?.zip_code
  }

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
      !incomeDependent
    ) {
      return toast({
        title: 'Composição Familiar',
        variant: 'destructive',
        description: 'Informe as Informações Componente Familiar'
      })
    }

    setTableCompositionsFamily((prevItems: any) => [
      ...prevItems,
      {
        name_dependent: nameDependent,
        CPF_dependent: CPFDependent,
        date_birth_dependent: dateBirthDependent,
        income_dependent: incomeDependent
      }
    ])
    setNameDependent('')
    setCPFDependent('')
    setDateBirthDependent(undefined)
    setIncomeDependent('')
  }

  const deleteComposition = async (value: Dependent) => {
    try {
      await axios.delete(`/api/dependent/${value.id}`)
      toast({
        title: 'Success',
        description: 'Dependente familiar deletado com sucesso!',
        variant: 'default'
      })
    } catch (error) {
      console.error('Erro ao deletar o dependente familiar:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o dependente familiar!',
        variant: 'destructive'
      })
    }
  }

  const removeFromTableCompositionsFamily = async (
    value: any,
    index: number
  ) => {
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
  }

  const addToTablePeriodBenefit = () => {
    if (!dateStartBenefit || !dateEndBenefit) {
      return toast({
        title: ' Períodos de Benefício',
        variant: 'destructive',
        description: 'Informe as Datas do Períodosde Benefício'
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
        title: 'Success',
        description: 'Período de benefício deletado com sucesso!',
        variant: 'default'
      })
    } catch (error) {
      console.error('Erro ao deletar o Período de benefício:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o Período de benefício!',
        variant: 'destructive'
      })
    } finally {
      router.refresh()
    }
  }

  const removeFromTablePeridBenefit = async (value: any, index: number) => {
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
  }

  const handleUpdateFamily = async (data: Familys) => {
    try {
      const dataUpdate = {
        ...data
      }

      const response = await axios.put(`/api/familys/${familie.id}`, dataUpdate)

      toast({
        title: 'Família Modificada',
        description: 'Família atualizada com sucesso!',
        variant: 'default'
      })

      return response.data
    } catch (error) {
      console.error('Erro ao atualizar a família:', error)

      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a família!',
        variant: 'destructive'
      })
    } finally {
      router.push(`/managementFamily/${userId}`)
      router.refresh()
    }
  }

  const onSubmit = async (
    data: FormData,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const info = {
      ...data,
      createdByUserId: '123',
      createdByUserName: 'Fulano de Tal',
      dependents: tableCompositionsFamily,
      periodBenefit: tableBenefitPeriod,
      notes: data.notes || ''
    }
    showLoading()
    try {
      if (familie && familie.id) {
        await handleUpdateFamily({
          ...info,
          createdByUserId: familie.createdByUserId,
          createdByUserName: familie.createdByUserName,
          status: familie.status,
          createdAt: familie.createdAt
        })
      } else {
        const response = await axios.post('/api/familys', info)

        toast({
          title: 'Cadastro de Família',
          description: 'Família cadastrada com sucesso!',
          variant: 'default'
        })

        return response.data
      }
    } catch (error) {
      console.error('Erro ao salvar a família:', error)

      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a família!',
        variant: 'destructive'
      })
    } finally {
      router.push(`/managementFamily/${familie.createdByUserId}`)
      router.refresh()
      stopLoading()
    }
  }

  return (
    <div>
      <PageHeading
        title="Gestão de Famílias"
        paths={[
          { href: '/home', name: 'Início' },
          { href: '/managementFamily', name: 'Gestão de Famílias' },
          { href: '#', name: 'Cadastro de Família' }
        ]}
      />

      <div className="border-b mb-5 pb-5 ">
        <p className="text-lg font-medium">Nova Família</p>
      </div>
      <Loading status={isLoading} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-8"
        >
          <div className="flex flex-col items-start w-full">
            <div className="border-b mb-5 pb-5 flex gap-8 w-full">
              <p className="text-sm font-medium w-[324px]">Dados de Pessoais</p>

              <div className=" flex gap-4  w-[656px] flex-wrap ">
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
                    <FormItem className="w-[328px]">
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="CPF" {...field} />
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
              </div>
            </div>

            <div className="border-b mb-5 pb-5 flex gap-8 w-full">
              <p className="text-sm font-medium w-[324px] ">Dados de Contato</p>
              <div className="w-[656px] flex gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-[308px]">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-[328px]">
                      <FormLabel>Celular</FormLabel>
                      <FormControl>
                        <Input placeholder="Celular" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-b mb-5 pb-5 flex gap-8 w-full">
              <p className="text-sm font-medium w-[324px] ">
                Composição Familiar
              </p>
              <div>
                <div className="flex w-[656px] gap-4 mb-10 flex-wrap">
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
                      <FormItem className="w-[328px]">
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="CPF"
                            value={CPFDependent}
                            onChange={e => setCPFDependent(e.target.value)}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="date_birth_dependent"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-[308px]">
                        <FormLabel className="mb-2.5">
                          Data de Nascimento
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'text-left font-normal',
                                  !dateBirthDependent && 'text-muted-foreground'
                                )}
                              >
                                {dateBirthDependent ? (
                                  format(
                                    Number(dateBirthDependent),
                                    'dd/MM/yyyy'
                                  )
                                ) : (
                                  <span>Selecione</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateBirthDependent}
                              onSelect={setDateBirthDependent}
                              disabled={date =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="income_dependent"
                    render={({ field }) => (
                      <FormItem className="w-[328px]">
                        <FormLabel>Renda</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Renda"
                            value={incomeDependent}
                            onChange={e => setIncomeDependent(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  className="mb-10 bg-blue-800"
                  onClick={addToTableCompositionsFamily}
                >
                  Adicionar
                </Button>
                <div className="w-[656px]">
                  <TabeBase className="bg-white rounded-sm">
                    <TableHeader className="bg-gray-200 rounded-sm">
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Data de Nascimento</TableHead>
                        <TableHead>Renda</TableHead>
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
                            <TableCell>{item.income_dependent}</TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                onClick={() =>
                                  removeFromTableCompositionsFamily(item, index)
                                }
                                className="bg-red-600"
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

            <div className="border-b mb-5 pb-5 flex gap-8 w-full">
              <p className="text-sm font-medium w-[324px] ">
                Períodos de Benefício
              </p>
              <div>
                <div className="flex w-[656px] gap-4 mb-10 flex-wrap">
                  <FormField
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-[308px]">
                        <FormLabel className="mb-2.5">
                          Data de Entrada
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'text-left font-normal',
                                  !dateStartBenefit && 'text-muted-foreground'
                                )}
                              >
                                {dateStartBenefit ? (
                                  format(Number(dateStartBenefit), 'dd/MM/yyyy')
                                ) : (
                                  <span>Selecione</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateStartBenefit}
                              onSelect={setDateStartBenefit}
                              disabled={date =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-[308px]">
                        <FormLabel className="mb-2.5">Data de Saída</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'text-left font-normal',
                                  !dateEndBenefit && 'text-muted-foreground'
                                )}
                              >
                                {dateEndBenefit ? (
                                  format(Number(dateEndBenefit), 'dd/MM/yyyy')
                                ) : (
                                  <span>Selecione</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateEndBenefit}
                              onSelect={setDateEndBenefit}
                              disabled={date =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  className="mb-10 bg-blue-800"
                  onClick={addToTablePeriodBenefit}
                >
                  Adicionar
                </Button>
                <div className="w-[656px]">
                  <TabeBase className="bg-white rounded-sm">
                    <TableHeader className="bg-gray-200 rounded-sm">
                      <TableRow>
                        <TableHead>Data de Entrada</TableHead>
                        <TableHead>Data de Saída</TableHead>
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
                              <Button
                                type="button"
                                onClick={() =>
                                  removeFromTablePeridBenefit(item, index)
                                }
                                className="bg-red-600"
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

            <div className="border-b mb-5 pb-5 flex gap-8 w-full">
              <p className="text-sm font-medium w-[324px]">Endereço</p>

              <div className=" flex gap-4  w-[656px] flex-wrap ">
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem className="w-[208px]">
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="CEP" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="w-[308px]">
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
                    <FormItem className="w-[208px]">
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
                    <FormItem className="w-[432px]">
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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                    <FormItem className="w-[320px]">
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
                            {' '}
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
              </div>
            </div>
            <div className="border-b mb-5 pb-5 flex gap-8 w-full">
              <p className="text-sm font-medium w-[324px]">Anotações</p>
              <div className="w-[356px]">
                <FormField
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="w-[656px]">
                      <FormLabel>Anotações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Anotações"
                          maxLength={1000}
                          defaultValue={familie ? familie.notes || '' : ''}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
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

              <Button type="submit" className="bg-blue-800">
                Salvar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
