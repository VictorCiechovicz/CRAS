'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/common/ui/button'
import { Input } from '@/components/common/ui/input'
import { useToast } from '@/components/common/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/common/ui/form'

const accountFormSchema = z.object({
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

type FormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
}

export function AgentForm() {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues
  })
  const { errors } = form.formState

  const { toast } = useToast()

  function onSubmit(data: FormValues) {
    console.log(data)
  }

  return (
    <div className="container mx-auto mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
              <FormItem>
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
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input placeholder="Senha" {...field} />
                </FormControl>
                <FormMessage>{errors.password?.message}</FormMessage>
              </FormItem>
            )}
          />
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
