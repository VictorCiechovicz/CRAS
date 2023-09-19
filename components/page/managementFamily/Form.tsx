'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/common/ui/button'
import { Calendar } from '@/components/common/ui/calendar'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/common/ui/form'
import { Input } from '@/components/common/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/common/ui/popover'
import { useToast } from '@/components/common/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/common/ui/select'
import { Textarea } from '@/components/common/ui/textarea'
import { useState } from 'react'
import {
  TabeBase,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/common/ui/table'
import { validCPF } from '@/utils/validate'
import { PageHeading } from '@/components/common'

const FormSchema = z.object({
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
      required_error: 'Informe CPF do representante da Família.'
    })
    .refine(validCPF, {
      message: 'CPF inválido.'
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
  notes: z.string().optional().nullable()
})

type FormValues = z.infer<typeof FormSchema>

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
}

type TableItem = {
  name_dependent: string | undefined
  CPF_dependent: string | undefined
  date_birth_dependent: string | undefined
  income_dependent: string | undefined
}

export function FamilyForm() {
  const [tableItems, setTableItems] = useState<TableItem[]>([])

  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues
  })
  const { toast } = useToast()

  const addToTable = () => {
    setTableItems((prevItems: any) => [
      ...prevItems,
      {
        name_dependent: form.watch('name_dependent'),
        CPF_dependent: form.watch('CPF_dependent'),
        date_birth_dependent: form.watch('date_birth_dependent'),
        income_dependent: form.watch('income_dependent')
      }
    ])
  }

  const removeFromTable = (index: any) => {
    setTableItems(prevItems => {
      const newItems = [...prevItems]
      newItems.splice(index, 1)
      return newItems
    })
  }
  function onSubmit(data: FormValues) {
    toast({
      title: 'Data',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    })
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col items-start w-full">
            <div className="border-b mb-5 pb-5 flex gap-8 w-full">
              <p className="text-sm font-medium w-[324px]">Dados de Pessoais</p>

              <div className=" flex gap-4  w-[656px] flex-wrap ">
            
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-[332px]">
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
                    <FormItem className="w-[332px]">
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
                    <FormItem className="w-[328px]">
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
                <div className="flex w-[656px] gap-4 mb-10">
                  <div>
                    <FormField
                      control={form.control}
                      name="name_dependent"
                      render={({ field }) => (
                        <FormItem className="w-[328px]">
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="CPF_dependent"
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
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="date_birth_dependent"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-[328px]">
                          <FormLabel className="mb-2.5">
                            Data de Nascimento
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    '  text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'dd/MM/yyyy')
                                  ) : (
                                    <span>Selecione</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
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
                      control={form.control}
                      name="income_dependent"
                      render={({ field }) => (
                        <FormItem className="w-[328px]">
                          <FormLabel>Renda</FormLabel>
                          <FormControl>
                            <Input placeholder="Renda" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button className="mb-10" onClick={addToTable}>
                  Adicionar à Tabela
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
                      {tableItems.length > 0 ? (
                        tableItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name_dependent}</TableCell>
                            <TableCell>{item.CPF_dependent}</TableCell>
                            <TableCell>
                              {format(item.date_birth_dependent, 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell>{item.income_dependent}</TableCell>
                            <TableCell>
                              <Button onClick={() => removeFromTable(index)}>
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
              <p className="text-sm font-medium w-[324px]">Anotações</p>
              <div className="w-[356px]">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="w-[656px]">
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

            <div className="flex justify-end gap-3 w-full">
              <Button variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
