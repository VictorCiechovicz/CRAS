'use client'

import React, { useState } from 'react'

import Link from 'next/link'
import { LinksAdmin, LinksAgent } from './const'
import { HomeIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import { Avatar } from '@/components/ui/avatar'
import ImageAvatar from '../../../public/images/placeholder.jpg'
import Image from 'next/image'
import clsx from 'clsx'

export function SideBar() {
  const [isAdmin, setIsAdmin] = useState(true)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const pathname = usePathname()

  const linksToRender = isAdmin ? LinksAdmin : LinksAgent

  return (
    <aside
      className="fixed top-0 left-0 z-50 h-screen bg-sidebar transition duration-150 ease-in-out w-[19.5rem] shadow-lg"
      aria-label="Sidebar"
    >
      <div className="relative h-full px-4 pb-6 pt-5 overflow-y-auto bg-white">
        <div className="mb-14 ml-6 flex items-end gap-2">
          <HomeIcon className="w-8 h-8 text-black" />
          <p className="text-black text-2xl font-semibold">CRAS</p>
        </div>
        <ul className="space-y-2 font-medium">
          <li>
            {linksToRender.map(link => {
              const isActive = pathname.includes(link.link)
              const isHovered = hoveredLink === link.link
              const linkClass = clsx(
                'flex items-center my-1 p-3 h-12 text-gray-500 text-base leading-6 font-medium rounded-lg group',
                {
                  'bg-blue-800 text-white': isActive || isHovered
                }
              )

              const iconClass = clsx('w-6 h-6', {
                'text-white': isActive || isHovered,
                'text-gray-500': !isActive && !isHovered
              })

              return (
                <Link
                  key={link.link}
                  href={link.link}
                  prefetch={false}
                  onMouseEnter={() => setHoveredLink(link.link)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={linkClass}
                >
                  <div className={iconClass}>
                    {React.cloneElement(link.icon, {
                      color: isActive || isHovered ? '#FFFFFF' : '#888888'
                    })}
                  </div>
                  <span
                    className={`ml-3 ${
                      isActive || isHovered ? 'text-white' : ''
                    }`}
                  >
                    {link.text}
                  </span>
                </Link>
              )
            })}
          </li>
        </ul>
        <div className="absolute bottom-0 left-0 flex gap-2 items-center p-4">
          <Avatar>
            <Image src={ImageAvatar} className="w-10 h-10" alt="Avatar" />
          </Avatar>
          <p className="text-base text-gray-500">Fulano da Silva</p>
        </div>
      </div>
    </aside>
  )
}
