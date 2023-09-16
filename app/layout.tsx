import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'


import './globals.css'
import { Toaster } from '@/components/common/ui/toaster'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CRAS App',
  description: 'CRAS App'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'bg-gray-100 min-h-screen')}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
