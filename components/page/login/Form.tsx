'use client'

import React, { useState } from 'react'

import { cn } from '@/lib/utils'




import { useRouter } from 'next/navigation'
import { useToast } from '@/components/common/ui/use-toast'
import { Label } from '@/components/common/ui/label'
import { Input } from '@/components/common/ui/input'
import { Button } from '@/components/common/ui/button'
import Loading from '@/components/common/Loading'

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

  }


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
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
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              disabled={isLoading}
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Loading status />
            )}
           Entrar
          </Button>
        </div>
      </form>

    </div>
  )
}