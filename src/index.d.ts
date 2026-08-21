import type * as React from 'react'

export interface ColumnDef<T = Record<string, unknown>> {
  id?: string
  name?: React.ReactNode
  selector?: (row: T) => unknown
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
  minWidth?: string
  [key: string]: unknown
}

export interface StackedColumnDef {
  id?: string
  columns: string[]
  index?: number
}

export declare function stackColumns<T = Record<string, unknown>>(
  columns: ColumnDef<T>[],
  stacks: StackedColumnDef[],
): ColumnDef<T>[]

export declare function useStackedColumns<T = Record<string, unknown>>(
  columns: ColumnDef<T>[],
  stacks: StackedColumnDef[],
): ColumnDef<T>[]

export declare function isStackedColumn(column: ColumnDef): boolean