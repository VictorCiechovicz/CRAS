'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Modal, Button, Textarea } from '@/src/components/common'
import { isValid } from 'date-fns'
import { DatePicker } from '../../DatePicker'

interface ApprovedModalProps {
  isModalConfirmOpen: boolean
  setIsModalConfirmOpen: (isOpen: boolean) => void
  typeUpdate: string
  handleUpdateStatus: (status: string) => Promise<void>
  dateStartBenefit: Date | undefined
  setDateStartBenefit: (date: Date | undefined) => void
  dateEndBenefit: Date | undefined
  setDateEndBenefit: (date: Date | undefined) => void
  notesReprove: string
  setNotesReprove: (notes: string) => void
}

const ApprovedModal: React.FC<ApprovedModalProps> = ({
  isModalConfirmOpen,
  setIsModalConfirmOpen,
  typeUpdate,
  handleUpdateStatus,
  dateStartBenefit,
  setDateStartBenefit,
  dateEndBenefit,
  setDateEndBenefit,
  notesReprove,
  setNotesReprove
}) => {
  const datePickerRef = useRef<HTMLInputElement>(null)

  const CustomInput = React.forwardRef((props: any, ref: any) => (
    <input
      className="border rounded-sm h-10 p-2"
      onClick={props.onClick}
      value={props.value}
      ref={ref}
      readOnly
    />
  ))

  useEffect(() => {
    if (isModalConfirmOpen && datePickerRef.current) {
      datePickerRef.current.focus()
    }
  }, [isModalConfirmOpen, datePickerRef])

  return (
    <Modal
      isOpen={isModalConfirmOpen}
      onClose={() => setIsModalConfirmOpen(false)}
    >
      <div className="p-3">
        <div className="flex justify-center pb-10">
          <p className="text-xl font-bold">
            Deseja {typeUpdate === 'ACTIVE' ? 'Aprovar' : 'Reprovar'} o Cadastro
            desta Família?
          </p>
        </div>
        {typeUpdate !== 'ACTIVE' ? (
          <Textarea
            className="mb-5"
            placeholder="Informe Motivo da Reprovação"
            maxLength={1000}
            value={notesReprove}
            onChange={e => setNotesReprove(e.target.value)}
          />
        ) : (
          <div className="w-full">
            
            <div className="flex gap-4 mb-10 justify-center">
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium  ">Data de Entrada</p>

                <DatePicker
                  customInput={<CustomInput ref={datePickerRef} />}
                  selected={
                    dateStartBenefit && isValid(new Date(dateStartBenefit))
                      ? new Date(dateStartBenefit)
                      : null
                  }
                  handleChangeDate={date => {
                    setDateStartBenefit(date ?? undefined)
                  }}
                  onChange={date => {
                    setDateStartBenefit(date ?? undefined)
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholder="Selecione uma data"
                  />
                   <p className='text-xs mt-2'>*Período para o Benefício</p>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium ">Data de Saída</p>

                <DatePicker
                  customInput={<CustomInput ref={datePickerRef} />}
                  selected={
                    dateEndBenefit && isValid(new Date(dateEndBenefit))
                      ? new Date(dateEndBenefit)
                      : null
                  }
                  handleChangeDate={date => {
                    setDateEndBenefit(date ?? undefined)
                  }}
                  onChange={date => {
                    setDateEndBenefit(date ?? undefined)
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholder="Selecione uma data"
                />
                </div>
               
              </div>
             
          </div>
        )}
        <div className="flex justify-center gap-2">
          <Button
            className=" w-full"
            variant="outline"
            onClick={event => {
              event.stopPropagation()
              setIsModalConfirmOpen(false)
            }}
          >
            Cancelar
          </Button>
          <Button
            disabled={
              typeUpdate !== 'ACTIVE'
                ? !notesReprove
                : !dateEndBenefit && !dateStartBenefit
            }
            className="bg-blue-800 w-full"
            onClick={event => {
              event.stopPropagation()
              handleUpdateStatus(typeUpdate)
            }}
          >
            Sim
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ApprovedModal
