export interface DataTableColumn<TData = unknown> {
  id: string
  header: string
  sortable?: boolean
  render?: (value: unknown, row: TData) => React.ReactNode
  accessorKey?: keyof TData
}

export interface DataTableAction<TData = unknown> {
  label: string
  icon?: React.ReactNode
  onClick: (row: TData) => void
  disabled?: (row: TData) => boolean
}

export interface DataTablePagination {
  page: number
  pageSize: number
  total: number
}

export interface DataTableSort {
  key: string
  direction: 'asc' | 'desc'
}

export interface DataTableProps<TData = unknown> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  actions?: DataTableAction<TData>[]
  pagination?: DataTablePagination
  onPaginationChange?: (pagination: DataTablePagination) => void
  sort?: DataTableSort
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void
  loading?: boolean
  emptyMessage?: string
  error?: string
}
