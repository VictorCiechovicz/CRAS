import { SideBar } from '@/src/components/common'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <SideBar />
      <main className=" p-6 sm:ml-[19.375rem]">{children}</main>
    </div>
  )
}
