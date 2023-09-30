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
      onClose()
    }

    return (
  
        <Dialog open={isOpen}  >
          <DialogContent className={className} onClick={closeModal}>
            <DialogHeader onClick={closeModal}>{headerContent}</DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
     
    )
  }
)
