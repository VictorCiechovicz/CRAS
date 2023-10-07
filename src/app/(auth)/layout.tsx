'use client'
import { SideBar } from '@/src/components/common'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default  function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session =  useSession()
  if (!session) redirect('/')
  return (
    <div>
      <SideBar />
      <main className="p-6 sm:ml-[19.375rem]">{children}</main>
    </div>
  )
}
