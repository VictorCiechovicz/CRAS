'use client'

import React, { MouseEvent, FC, ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'

interface ModalProps {
  isOpen?: boolean
  onClose(): void
  className?: string
  headerContent?: ReactNode
  children: ReactNode
}
export const Modal: FC<ModalProps> = React.memo(
  ({ isOpen = false, onClose, children, className = '', headerContent }) => {
    const closeModal = (event: MouseEvent<HTMLElement>) => {
      console.log('Closing modal')
      onClose()
    }

    return (
      <Dialog open={isOpen}>
        <DialogContent
          className={`sm:max-w-[425px] flex items-center justify-center ${className}`}
          onClick={closeModal}
        >
          <DialogHeader onClick={closeModal}>{headerContent}</DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  }
)
