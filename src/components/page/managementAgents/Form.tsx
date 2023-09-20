'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/src/components/common/ui/button'
import { Input } from '@/src/components/common/ui/input'
import { useToast } from '@/src/components/common/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/src/components/common/ui/form'
import { PageHeading } from '@/src/components/common'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/common/ui/select'

const FormSchema = z.object({
  type: z.string({
    required_error: 'Informe o Tipo deste Agente.'
  }),
  name: z
    .string({
      required_error: 'Informe o Nome Completo do Agente.'
    })

    .min(1, {
      message: 'Nome muito curto.'
    })
    .max(30, {
      message: 'Nome com numero máximo de 30 caracteres.'
    }),

  email: z
    .string({
      required_error: 'Informe Email.'
    })
    .email('Formato de Email inválido!'),
  phone: z.string({
    required_error: 'Informe Celular.'
  }),
  password: z
    .string({
      required_error: 'Informe Senha.'
    })
    .min(6, { message: 'Senha é muito fraca! Escolha no mínimo 6 caracteres.' })
})

type FormValues = z.infer<typeof FormSchema>

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
}

export function AgentForm() {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues
  })
  const { errors } = form.formState
  const { toast } = useToast()

  async function onSubmit(infoUser: FormValues) {
    try {
      const data = {
        name: infoUser.name,
        email: infoUser.email,
        password: infoUser.password,
        userType: infoUser.type,
        userPhone: infoUser.phone
      }

      toast({
        title: 'Agente Cadastrado',
        description: 'Cadastrado realizado com Sucesso'
      })
    } catch (error) {
      toast({
        title: 'Erro ao Cadastrar Agente',
        description: 'Ocorreu um erro ao Cadastrar Agente'
      })
    } finally {
      router.push('/managementAgents')
    }
  }

  return (
    <div>
      <PageHeading
        title="Cadastro de Agente"
        paths={[
          { href: '/home', name: 'Início' },
          { href: '/managementAgents', name: 'Gestão de Agentes' },
          { href: '#', name: 'Cadastro de Agente' }
        ]}
      />
      <div className="border-b mb-5 pb-5 ">
        <p className="text-lg font-medium">Novo Agente</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col items-start w-full">
            <div className="border-b mb-5 pb-5 flex gap-8 w-full">
              <p className="text-sm font-medium w-[324px]">Dados de Pessoais</p>

              <div className=" flex gap-4  w-[686px] flex-wrap ">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-[670px]">
                      <FormLabel>Tipo</FormLabel>
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
                            <SelectItem value="Admin">Administrador</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-[328px]">
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome Completo" {...field} />
                      </FormControl>

                      <FormMessage>{errors.name?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-[328px]">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>

                      <FormMessage>{errors.email?.message}</FormMessage>
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

                      <FormMessage>{errors.phone?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-[328px]">
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="Senha" {...field} />
                      </FormControl>
                      <FormMessage>{errors.password?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
