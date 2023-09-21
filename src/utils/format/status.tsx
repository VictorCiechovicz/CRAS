const StatusProps = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  PENDING: 'Pendente'
}

export const formatStatus = (value?: keyof typeof StatusProps) => {
  if (!value) return ''

  const formattedValue = StatusProps[value]

  if (value === 'ACTIVE') {
    return (
      <span className="text-green-700 text-xs bg-green-50 px-2 py-1 rounded-sm border-green-700 border">
        {formattedValue}
      </span>
    )
  }
  if (value === 'INACTIVE') {
    return (
      <span className="text-red-700 text-xs bg-red-100 px-2 py-1 rounded-sm border-red-700 border">
        {formattedValue}
      </span>
    )
  }
  return (
    <span className="text-yellow-500 text-xs bg-yellow-100 px-2 py-1 rounded-sm">
      {formattedValue}
    </span>
  )
}
