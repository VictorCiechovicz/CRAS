'use client'

import React, { useState } from 'react'
import { Modal, Button, Textarea } from '@/src/components/common'
import { format, isValid } from 'date-fns'
import { DatePicker } from '../../DatePicker';

interface ApprovedModalProps {
  isModalConfirmOpen: boolean;
  setIsModalConfirmOpen: (isOpen: boolean) => void;
  typeUpdate: string;
  handleUpdateStatus: (status: string) => Promise<void>;
  dateStartBenefit: Date | undefined;
  setDateStartBenefit: (date: Date | undefined) => void;
  dateEndBenefit: Date | undefined;
  setDateEndBenefit: (date: Date | undefined) => void;
  notesReprove: string;
  setNotesReprove: (notes: string) => void;
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
  return (
    <Modal
      isOpen={isModalConfirmOpen}
      onClose={() => setIsModalConfirmOpen(false)}
    >
      <div>
        <div className="flex justify-center pb-10">
          <p className="text-xl font-bold">
            Deseja {typeUpdate === 'ACTIVE' ? 'Aprovar' : 'Reprovar'} o cadastro desta Família?
          </p>
        </div>
        {typeUpdate !== 'ACTIVE' ? (
          <Textarea
            className="mb-3"
            placeholder="Informe motivo da Reprovação"
            maxLength={1000}
            value={notesReprove}
            onChange={e => setNotesReprove(e.target.value)}
          />
        ) : (
          <div>
          <p className="text-lg font-medium ">Períodos de Benefício</p>
          <div className="flex gap-4 mb-10 justify-center">
            <div>
              <p className="text-sm font-medium ">Data de Entrada</p>

              <DatePicker
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
            </div>
            <div>
              <p className="text-sm font-medium ">Data de Saída</p>

              <DatePicker
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
            className="w-40"
            variant="outline"
            onClick={event => {
              event.stopPropagation();
              setIsModalConfirmOpen(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            disabled={typeUpdate === 'INACTIVE' && !notesReprove}
            className="bg-blue-800 w-40"
            onClick={event => {
              event.stopPropagation();
              handleUpdateStatus(typeUpdate);
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
