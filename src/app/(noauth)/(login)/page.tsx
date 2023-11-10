'use client'

import { LoginForm } from '@/src/components/page'
import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import Loading from './loading'

export default function Login() {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      signIn('keycloak', { callbackUrl: '/home' })
    }
  }, [session])
  return <Loading />
}
