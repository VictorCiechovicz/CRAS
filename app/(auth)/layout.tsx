import { SideBar } from '@/components/common'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white;">
      <SideBar />
      <main
        className='bg-white p-6 sm:ml-[19.375rem]'    >
        {children}
      </main>
    </div>
  )
}
