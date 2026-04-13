export interface DataTableColumn<TData> {
  id: string
  header: string
  accessorKey?: keyof TData
  cell?: (row: TData) => React.ReactNode
  sortable?: boolean
  width?: string
}

export interface DataTablePaginationState {
  page: number
  pageSize: number
  total: number
}

export interface DataTableSortState {
  column: string | null
  direction: 'asc' | 'desc' | null
}

export interface DataTableFilterState {
  [key: string]: string | string[] | null
}

export interface DataTableAction<TData> {
  label: string
  onClick: (row: TData) => void | Promise<void>
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'destructive'
  disabled?: (row: TData) => boolean
}

export interface DataTableProps<TData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  actions?: DataTableAction<TData>[]
  pagination?: DataTablePaginationState
  onPaginationChange?: (page: number, pageSize: number) => void
  sort?: DataTableSortState
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void
  loading?: boolean
  emptyMessage?: string
  error?: string
  selectable?: boolean
  selectedRows?: Set<string | number>
  onSelectionChange?: (selectedIds: Set<string | number>) => void
  getRowId?: (row: TData) => string | number
  bulkActions?: DataTableAction<TData[]>[]
  showRowNumber?: boolean
}
