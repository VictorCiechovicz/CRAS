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
import { Tooltip } from 'react-tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '..'

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
  onRowClick,
  isFilterStatus = false
}: TableProps<T> & PaginationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState(data)
  const [statusFilter, setStatusFilter] = useState('')

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

    const csv = Papa.unparse(organizedData, {
      delimiter: ';'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    saveAs(blob, 'familias.csv')
  }

  useEffect(() => {
    if (searchQuery) {
      setFilteredData(
        data?.filter((row: any) =>
          columns?.some(
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

  useEffect(() => {
    let filtered = data

    if (searchQuery) {
      filtered = filtered?.filter(row =>
        columns.some(col =>
          row[col.field]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(row => row.status === statusFilter)
    }

    setFilteredData(filtered)
  }, [searchQuery, statusFilter, data, columns])

  return (
    <div className="bg-white rounded-3xl shadow-md">
      <div className="pb-12 pt-11 w-full flex justify-between items-center px-7 ">
        <p className="text-2xl font-semibold">{title}</p>
        <div className="flex items-end gap-4">
          {isFilterStatus && (
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger aria-label="Filtrar por status">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
                  <SelectItem value="">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Search onSearchChange={setSearchQuery} />
          </div>
          <div
            data-tooltip-id="tooltip-exportcsv"
            data-tooltip-content={'Download CSV'}
            data-tooltip-place="top"
            className="cursor-pointer"
          >
            <Tooltip id="tooltip-exportcsv" />
            <ArrowDownTrayIcon
              onClick={exportToCSV}
              className="btn btn-primary w-6 h-6"
            />
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <p className="text-center py-5">{emptyMessage}</p>
      ) : (
        <>
          <TabeBase>
            {caption && <TableCaption>{caption}</TableCaption>}
            <TableHeader className="whitespace-nowrap">
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
