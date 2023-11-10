import { SideBar } from '@/src/components/common'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
   if (!session) redirect('/')  
 

  return (
    <div>
      <SideBar />
      <main className="p-6 sm:ml-[19.375rem]">{children}</main>
    </div>
  )
}
