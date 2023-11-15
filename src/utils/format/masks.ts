

export const formatCPF = (cpf: string) => {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const formatMoney = (money: string) => {
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

export const formatCEP = (cep: string) => {
  return cep.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2')
}

export const formatPhoneNumber = (phone: string) => {
  return phone
    .replace(/\D/g, '')
    .replace(/(\d{1})(\d)/, '($1$2')
    .replace(/(\d{2})(\d)/, '$1)$2')
    .replace(/(\d{2})(\d)/, ' $1$2')
    .replace(/(\d{5})(\d{1})/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}
