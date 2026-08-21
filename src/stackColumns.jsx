/**
 * @summary     StackColumn Plugin for react-data-table-component
 * @description React port of the DataTables stackColumn plugin.
 *              Merges any 2 (or more) columns into a single stacked column:
 *              both headers are shown stacked in the column header and both
 *              cell values are stacked with a separator. The original columns
 *              are removed from the visible column list but stay referenced
 *              on the stacked column (_isStackedColumn / _stackedColumns).
 * @author      Abhishek Sharma <abhisheksharma86490@gmail.com> (https://github.com/AbhishekSharma-86)
 */
import { useMemo } from 'react'

function buildSortComparator(column) {
  const selector = column.selector
  return (rowA, rowB) => {
    const a = selector ? selector(rowA) : rowA?.[column.id]
    const b = selector ? selector(rowB) : rowB?.[column.id]
    if (a == null && b == null) return 0
    if (a == null) return -1
    if (b == null) return 1
    return String(a).localeCompare(String(b), undefined, { numeric: true })
  }
}

function sumPxWidths(columns) {
  return columns.reduce((sum, col) => {
    const match = String(col.width || col.minWidth || '').match(/(\d+)/)
    return sum + (match ? parseInt(match[1], 10) : 0)
  }, 0)
}

function StackHeader({ subColumns }) {
  return (
    <div className="dt-stack-header">
      {subColumns.map((col, idx) => (
        <div key={col.id} className="dt-column dt-stack-header-title">
          {idx > 0 && <div className="dt-stack-separator" />}
          {col.name}
        </div>
      ))}
    </div>
  )
}

function StackedCell({ row, subColumns }) {
  return (
    <div className="dt-stack-cell">
      {subColumns.map((col, idx) => {
        const value = col.cell ? col.cell(row) : col.selector ? col.selector(row) : row?.[col.id]
        return (
          <div key={col.id} className="dt-stack-cell-row">
            {idx > 0 && <div className="dt-stack-separator" />}
            <div className="dt-stack-data one-row-dot-overflow">{value ?? '\u00A0'}</div>
          </div>
        )
      })}
    </div>
  )
}

function createStackColumn(stack, subColumns, columns) {
  const stackHistory = Object.fromEntries(subColumns.map((col) => [col.id, columns.indexOf(col)]))
  const totalWidth = sumPxWidths(subColumns)
  return {
    id: stack.id ?? subColumns.map((col) => col.id).join('-'),
    name: <StackHeader subColumns={subColumns} />,
    cell: (row) => <StackedCell row={row} subColumns={subColumns} />,
    selector: subColumns[0].selector,
    sortable: subColumns.some((col) => col.sortable !== false),
    sortFunction: buildSortComparator(subColumns[0]),
    center: true,
    grow: 1,
    ...(totalWidth > 0 ? { minWidth: `${totalWidth}px` } : {}),
    _isStackedColumn: true,
    _stackedColumns: stackHistory,
  }
}

/**
 * Transform column definitions so that each entry of `stacks` collapses into
 * a single stacked column placed where its first sub-column used to be.
 *
 * @param {Array} columns - react-data-table-component column definitions.
 * @param {Array} stacks  - e.g. [{ id: 'nameTitle', columns: ['name', 'title'], index: 1 }]
 * @returns {Array} transformed column definitions.
 */
export function stackColumns(columns, stacks) {
  if (!stacks?.length) return columns

  const consumed = new Set()
  const insertionMap = new Map()

  stacks.forEach((stack) => {
    const subColumns = stack.columns
      .map((id) => columns.find((col) => col.id === id))
      .filter(Boolean)

    if (subColumns.length < 2) {
      console.warn(`[stackColumns] stack "${stack.id ?? stack.columns.join(',')}" needs at least 2 existing columns; skipped.`)
      return
    }
    if (subColumns.some((col) => consumed.has(col.id))) {
      console.warn(`[stackColumns] stack "${stack.id ?? stack.columns.join(',')}" reuses an already stacked column; skipped.`)
      return
    }
    subColumns.forEach((col) => consumed.add(col.id))

    const firstIndex = columns.findIndex((col) => col.id === subColumns[0].id)
    const position = typeof stack.index === 'number' ? stack.index : firstIndex
    insertionMap.set(position, createStackColumn(stack, subColumns, columns))
  })

  const result = []
  columns.forEach((col, idx) => {
    if (insertionMap.has(idx)) result.push(insertionMap.get(idx))
    if (!consumed.has(col.id)) result.push(col)
  })
  for (const [position, column] of insertionMap) {
    if (position >= columns.length) result.push(column)
  }
  return result
}

/**
 * Hook wrapper: memoised stackColumns() so re-renders stay cheap.
 */
export function useStackedColumns(columns, stacks) {
  return useMemo(() => stackColumns(columns, stacks), [columns, stacks])
}

export function isStackedColumn(column) {
  return column?._isStackedColumn === true
}