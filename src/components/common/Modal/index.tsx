'use client'

import React, { MouseEvent, FC, ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalProps {
  isOpen?: boolean
  onClose(): void
  children: ReactNode
  isCloseButton?: boolean
}

export const Modal: FC<ModalProps> = React.memo(
  ({ isOpen = false, onClose, children, isCloseButton = true }) => {
    const closeModal = (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      onClose()
    }

    return (
      isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg md:w-full max-h-[900px] overflow-y-auto">
            {isCloseButton && (
              <div
                className="flex justify-end text-center sm:text-left cursor-pointer hover:text-gray-400"
                onClick={closeModal}
              >
                <XMarkIcon className="w-5 h-5" />
              </div>
            )}

            <div>{children}</div>
          </div>
        </div>
      )
    )
  }
)
