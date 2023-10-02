'use client'

import { useEffect, useState } from 'react'

import { Pagination } from './Pagination'
import { Search } from './Search'
import clsx from 'clsx'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { PaginationProps, TableProps } from './types'
import {
  TabeBase,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { Dependent, PeriodBenefit } from '@prisma/client'
import { format } from 'date-fns'

const statusMap = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  PENDING: 'Pendente'
} as any

export function Table<T>({
  caption,
  columns,
  data,
  title,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  emptyMessage = 'Não há itens na tabela.',
  onRowClick
}: TableProps<T> & PaginationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState(data)

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const exportToCSV = () => {
    const organizedData = filteredData.map(item => {
      const modifiedDependents = item.dependents
        ? item.dependents.map((dependent: Dependent) => {
            return {
              Nome: dependent.name_dependent,
              Cpf: dependent.CPF_dependent,
              Data_Nascimento: format(
                new Date(dependent.date_birth_dependent),
                'dd/MM/yyyy'
              ),
              Renda: dependent.income_dependent
            }
          })
        : []
      const modifiedPeriodBenefit = item.periodBenefit
        ? item.periodBenefit.map((period: PeriodBenefit) => {
            return {
              Inicio: format(new Date(period.startDate), 'dd/MM/yyyy'),
              Fim: format(new Date(period.endDate), 'dd/MM/yyyy')
            }
          })
        : []

      const status = statusMap[item.status] || item.status

      return {
        Nome: item.name,
        CPF: item.CPF,
        RG: item.RG,
        Email: item.email,
        Celular: item.phone,
        Cidade: item.city,
        Bairro: item.neighborhood,
        Estado: item.state,
        Rua: item.street,
        CEP: item.zip_code,
        Agente: item.createdByUserName,
        Status: status,
        Dependentes: JSON.stringify(modifiedDependents),
        Perido_Beneficio: JSON.stringify(modifiedPeriodBenefit)
      }
    })

    console.log(organizedData)

    const csv = Papa.unparse(organizedData, {
      delimiter: ';'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    saveAs(blob, 'familias.csv')
  }

  useEffect(() => {
    if (searchQuery) {
      setFilteredData(
        data.filter((row: any) =>
          columns.some(
            (col: any) =>
              row[col.field] !== null &&
              row[col.field] !== undefined &&
              row[col.field]
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        )
      )
    } else {
      setFilteredData(data)
    }
  }, [searchQuery, data, columns])

  return (
    <div className="bg-white rounded-lg">
      <div className="pb-12 pt-11 w-full flex justify-between items-center px-7 ">
        <p className="text-2xl font-semibold">{title}</p>
        <div className="flex gap-4">
          <Search onSearchChange={setSearchQuery} />
          <ArrowDownTrayIcon
            onClick={exportToCSV}
            className="btn btn-primary w-6 he-6"
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <p className="text-center py-5">{emptyMessage}</p>
      ) : (
        <>
          <TabeBase>
            {caption && <TableCaption>{caption}</TableCaption>}
            <TableHeader>
              <TableRow>
                {columns.map((col, index) => (
                  <TableHead key={index} className={col.className}>
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={clsx('whitespace-nowrap', col.cellClassName)}
                    >
                      {col?.renderCell
                        ? col.renderCell(row[col.field], row)
                        : col?.valueFormatter
                        ? col.valueFormatter(row[col.field])
                        : row[col.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TabeBase>

          <Pagination
            data={data}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </>
      )}
    </div>
  )
}
