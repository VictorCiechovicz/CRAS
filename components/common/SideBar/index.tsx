'use client'

import { useState } from 'react'

import Link from 'next/link'
import { LinksAdmin, LinksAgent } from './const'
import { HomeIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'

export function SideBar() {
  const [isAdmin, setIsAdmin] = useState(true)

  const pathname = usePathname()

  const linksToRender = isAdmin ? LinksAdmin : LinksAgent

  return (
    <aside
      className="fixed top-0 left-0 z-50 h-screen bg-sidebar transition duration-150 ease-in-out w-[19.5rem]"
      aria-label="Sidebar"
    >
      <div className=" h-full px-4 pb-6 pt-5 overflow-y-auto bg-sidebar bg-blue-900">
        <div className="mb-14 ml-6 flex items-end gap-2">
          <HomeIcon className="w-8 h-8 text-white" />
          <p className="text-white text-2xl font-semibold">CRAS</p>
        </div>
        <ul className="space-y-2 font-medium">
          <li>
            {linksToRender.map(link => {
              if (!link.link && link.links?.length) {
                return (
                  <>
                    {link.links.map(li => (
                      <Link
                        key={li.link}
                        href={li.link}
                        prefetch={false}
                        className={`flex items-center my-1 p-3 h-12 text-white text-base leading-6 font-medium rounded-lg hover:bg-linkSideBarHover group ml-6 ${
                          pathname.includes(li.link)
                            ? 'bg-linkSideBarHover'
                            : ''
                        }`}
                      >
                        <span className="text-black">{li.text}</span>
                      </Link>
                    ))}
                  </>
                )
              }

              return (
                <Link
                  key={link.link}
                  href={link.link}
                  prefetch={false}
                  className={`flex items-center my-1 p-3 h-12 text-white text-base leading-6 font-medium rounded-lg hover:bg-linkSideBarHover group ${
                    pathname.includes(link.link) ? 'bg-linkSideBarHover' : ''
                  }`}
                >
                  <div className="w-5 h-5 text-white">{link.icon}</div>
                  <span className="ml-3">{link.text}</span>
                </Link>
              )
            })}
          </li>
        </ul>
      </div>
    </aside>
  )
}
