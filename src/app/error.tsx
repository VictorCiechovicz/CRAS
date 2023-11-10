'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../components/common'

export default function Error() {
  const router = useRouter()
  return (
    <div className="flex  justify-center items-center h-screen">
      <div className="flex flex-col">
        <p className="font-bold text-9xl mt-4">404</p>
        <h2 className="mt-2 mb-4">Erro ao buscar informações no servidor</h2>
        <Button color="error" onClick={() => router.refresh()}>
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
