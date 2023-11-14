'use client'
import * as React from 'react'
import { cn } from '@/src/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'cpf' | 'rg' | 'cep' | 'money' | 'email' | 'password'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [cpfValue, setCpfValue] = React.useState('')
    const [rgValue, setRgValue] = React.useState('')
    const [moneyValue, setMoneyValue] = React.useState('')
    const [cepValue, setCepValue] = React.useState('')

    const formatCPF = (cpf: string) => {
      return cpf
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    }

    const formatRG = (rg: string) => {
      return rg
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    }

    const formatMoney = (money: string) => {
      if (!money) {
        return ''
      }

      money = money.replace('.', '').replace(',', '').replace(/\D/g, '')

      const options = { minimumFractionDigits: 2 }
      const result = new Intl.NumberFormat('pt-BR', options).format(
        parseFloat(money) / 100
      )

      return result
    }

    const formatCEP = (cep: string) => {
      return cep.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2')
    }

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedCep = formatCEP(e.target.value)
      setCepValue(formattedCep)
    }

    const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedMoney = formatMoney(e.target.value)
      setMoneyValue(formattedMoney)
    }

    const handleRGChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedRG = formatRG(e.target.value)
      setRgValue(formattedRG)
    }

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedCPF = formatCPF(e.target.value)
      setCpfValue(formattedCPF)
    }

    let inputTypeProps = {}

    if (type === 'cpf') {
      inputTypeProps = { value: cpfValue, onChange: handleCPFChange }
    } else if (type === 'rg') {
      inputTypeProps = { value: rgValue, onChange: handleRGChange }
    } else if (type === 'money') {
      inputTypeProps = { value: moneyValue, onChange: handleMoneyChange }
    } else if (type === 'cep') {
      inputTypeProps = { value: cepValue, onChange: handleCepChange }
    }

    return (
      <input
        type={type || 'text'}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
        {...inputTypeProps}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
