
export interface Column<T> {
  label: string
  field: string
  className?: string
  cellClassName?: string
}

export interface TableData {
  [key: string]: string | number | boolean | null | undefined
}

export interface TableProps<T> {
  caption?: string
  columns: Column<T>[];
  data: Page<T>[];
  title?: string

}

export interface PaginationProps {
  currentPage: number
  pageSize: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newSize: number) => void
}