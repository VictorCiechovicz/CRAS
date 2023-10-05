'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {  useNavigationLinks } from './const'
import {
  ArrowRightOnRectangleIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar } from '@/src/components/common/ui/avatar'
import ImageAvatar from '../../../../public/images/placeholder.jpg'
import Image from 'next/image'
import clsx from 'clsx'
import { Tooltip } from 'react-tooltip'
import { signOut, useSession } from 'next-auth/react'
import useLoading from '@/src/hook/useLoading'
import Loading from '../Loading'

export function SideBar() {
  const [isAdmin, setIsAdmin] = useState(true)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isLoading, showLoading, stopLoading } = useLoading()

  const { LinksAdmin, LinksAgent } = useNavigationLinks(); 
  const linksToRender = isAdmin ? LinksAdmin : LinksAgent;

  const handleSignOut = async () => {
    showLoading()
    await signOut({ callbackUrl: '/' })
    stopLoading()
  }
  useEffect(() => {
    if ((session?.user as any)?.role === 'agent') {
      setIsAdmin(false)
    }
  }, [session])

  return (
    <>
      {isLoading && <Loading status={isLoading} />}

      <aside
        className="fixed top-0 left-0 z-50 h-screen bg-sidebar transition duration-150 ease-in-out w-[19.5rem] shadow-lg"
        aria-label="Sidebar"
      >
        <div className="relative h-full px-4 pb-6 pt-8 overflow-y-auto bg-white">
          <div
            className="mb-14 ml-6 flex items-end gap-2 cursor-pointer"
            onClick={() => router.push('/home')}
          >
            <HomeIcon className="w-12 h-12 text-black" />
            <p className="text-black text-3xl font-semibold">CRAS</p>
          </div>
          {session && (
            <>
              <ul className="space-y-2 font-medium">
                <li>
                  {linksToRender.map(link => {
                    const isActive = pathname.includes(link.link)
                    const isHovered = hoveredLink === link.link
                    const linkClass = clsx(
                      'flex items-center my-1 p-3 h-12 text-gray-500 text-base leading-6 font-medium rounded-sm group',
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
                            color:
                              isActive || isHovered
                                ? '#FFFFFF'
                                : 'text-gray-500'
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
              <div className="absolute bottom-0 left-0 flex gap-20  items-center p-4">
                <div className="flex gap-2 ">
                  <div>
                    <Avatar>
                      <Image
                        src={ImageAvatar}
                        className="w-10 h-10"
                        alt="Avatar"
                      />
                    </Avatar>
                  </div>

                  <p className="text-base  whitespace-nowrap mt-2 text-gray-500">
                    {session?.user?.name}
                  </p>
                </div>

                <div
                  className="cursor-pointer"
                  onClick={() => {}}
                  data-tooltip-id="tooltip-signout"
                  data-tooltip-content={'Sair'}
                  data-tooltip-place="top"
                >
                  <Tooltip id="tooltip-signout" />
                  <div className="cursor-pointer" onClick={handleSignOut}>
                    <ArrowRightOnRectangleIcon className="w-7 h-7 text-gray-500 hover:text-gray-400" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
