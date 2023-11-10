
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../api/auth/[...nextauth]/route'


export default async function NoAuthLayout({
  children
}: {
  children: React.ReactNode
  }) {
  
    const session = await getServerSession(authOptions)
  if (session) redirect('/home')  
  
  return <div>{children}</div>
}
