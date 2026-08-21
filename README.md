# Datatable Stack Columns

Stack any **2 (or more) columns** of a `react-data-table-component` table into a single stacked column — headers and cell values render stacked with a separator line. React port of the [DataTables stackColumn plugin](https://datatables.net/plug-ins/columns/).

## Install

```bash
npm install datatable-stack-columns
```

Requires `react >= 18` and `react-data-table-component >= 7` (peer dependencies).

Import the styles once:

```js
import 'datatable-stack-columns/styles.css'
```

## Usage

```jsx
import DataTable from 'react-data-table-component'
import { useStackedColumns } from 'datatable-stack-columns'

const COLUMNS = [
  { id: 'name', name: 'Name', selector: (row) => row.name, sortable: true },
  { id: 'title', name: 'Title', selector: (row) => row.title, sortable: true },
  { id: 'email', name: 'Email', selector: (row) => row.email },
]

function App() {
  const columns = useStackedColumns(COLUMNS, [{ id: 'nameTitle', columns: ['name', 'title'] }])
  return <DataTable columns={columns} data={rows} />
}
```

The `Name` and `Title` columns collapse into one stacked column placed where `name` used to be.

## API

### `stackColumns(columns, stacks)` / `useStackedColumns(columns, stacks)`

| Option    | Type       | Required | Description |
|-----------|------------|----------|-------------|
| `id`      | `string`   | no       | Unique id for the merged column (defaults to sub-column ids joined with `-`). |
| `columns` | `string[]` | **yes**  | Ids of the columns to stack (minimum 2). |
| `index`   | `number`   | no       | Insertion index; defaults to the position of the first sub-column. |

### `isStackedColumn(column)`

Returns `true` when the column was produced by the plugin (`_isStackedColumn`).

## Behavior

- The stacked column sorts by the **first** sub-column's `selector`.
- `minWidth` defaults to the sum of sub-column widths when declared (`px` only).
- Stacks referencing unknown ids, fewer than 2 columns, or columns already stacked elsewhere are skipped with a `console.warn`.
- The merged column carries `_isStackedColumn` and `_stackedColumns: { colId: originalIndex }` metadata.

## Styles

All classes are prefixed `dt-stack-` (`.dt-stack-header`, `.dt-stack-cell`, `.dt-stack-separator`, `.dt-stack-data`, `.one-row-dot-overflow`). Override them in your own CSS after the import to customize the look.

## License

MIT

## Author

Created by [Abhishek Sharma](https://github.com/AbhishekSharma-86)