'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'

export interface BaseModalProps {
  children?: ReactNode
  isOpen: boolean
  onClose(): void
}

export function Modal({ children, isOpen, onClose }: BaseModalProps) {
  const closeModal = (event: React.MouseEvent) => {
   
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 " onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#344054B2] bg-opacity-20 backdrop-blur-sm " />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto ">
          <div
            className="flex min-h-full items-center justify-center p-4 text-center "
            onClick={closeModal}
          >
            <div className="bg-white p-4 rounded-lg ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {children}
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
