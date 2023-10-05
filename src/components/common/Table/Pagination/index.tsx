import clsx from 'clsx'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { PaginationProps, TableData } from '../types'

export function Pagination({
  data,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationProps & { data: TableData[] }) {
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center rounded-3xl space-x-4 justify-between px-6 py-6 shadow-sm">
      <div>
        <label htmlFor="pageSize">Exibindo:</label>
        <select
          id="pageSize"
          value={pageSize}
          className=" justify-center items-center gap-3 w-11 h-10 rounded-sm bg-gray-100 ml-3"
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          {[10, 20, 30, 50].map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="disabled:bg-gray-50 flex justify-center items-center w-10 h-7 bg-gray-200 rounded-sm border border-gray-300"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        {pageNumbers.map(num => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={clsx(
              `
              flex
              justify-center
              items-center
              w-7 h-7
              bg-gray-200
              rounded-sm
              border
              border-gray-300
              hover:bg-blue-400
              `,
              num === currentPage && ' bg-blue-700 border-blue-400 text-white'
            )}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className=" flex justify-center items-center w-10 h-7 bg-gray-200 rounded-sm border border-gray-300 disabled:bg-gray-50 "
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
