const StatusProps = {
  ACTIVE: 'Recebendo',
  INACTIVE: 'Não Recebe',
  PENDING: 'Em Análise'
}

export const formatStatus = (value?: keyof typeof StatusProps) => {
  if (!value) return ''

  const formattedValue = StatusProps[value]

  if (value === 'ACTIVE') {
    return (
      <span className="text-green-700 text-xs bg-green-50 font-medium px-4 py-1 rounded-xl ">
        {formattedValue}
      </span>
    )
  }
  if (value === 'INACTIVE') {
    return (
      <span className="text-red-700 text-xs  bg-red-100 font-medium px-2 py-1 rounded-xl ">
        {formattedValue}
      </span>
    )
  }
  return (
    <span className="text-yellow-500 text-xs bg-yellow-100 font-medium px-2 py-1 rounded-xl ">
      {formattedValue}
    </span>
  )
}
