'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'
import { useToast } from '@/src/components/common/ui/use-toast'
import { Label } from '@/src/components/common/ui/label'
import { Input } from '@/src/components/common/ui/input'
import { Button } from '@/src/components/common/ui/button'
import Loading from '@/src/components/common/Loading'
import Image from 'next/image'
import LogoCras from '../../../../public/images/logo-cras.png'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface IUser {
  email: string
  password: string
}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<IUser>({
    email: '',
    password: ''
  })

  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const infos = {
        email: data.email,
        password: data.password
      }

      toast({
        title: 'Ebaa....',
        description: 'Login Bem sucedido'
      })
    } catch (error) {
      toast({
        title: 'Erro ao fazer Login!',
        description: 'Ocorreu algum erro ao realizar login'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }

  return (
    <div
      {...props}
      className=" px-10 bg-white w-[448px] h-[500px] rounded-lg shadow-sm "
    >
      <div className="w-full flex justify-center pt-7 pb-7">
        <Image alt="Logo Cras" src={LogoCras} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid mb-14">
            <Label className="mb-5" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              disabled={isLoading}
              name="email"
              value={data.email}
              onChange={handleChange}
              className="mb-5"
            />
            <Label className="mb-5" htmlFor="password">
              Senha
            </Label>
            <Input
              id="password"
              placeholder="Senha"
              type="password"
              autoCapitalize="none"
              disabled={isLoading}
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <Button
            disabled={isLoading}
            className="bg-blue-800 text-white rounded-lg"
          >
            {isLoading && <Loading status />}
            Entrar
          </Button>
        </div>
      </form>
    </div>
  )
}
