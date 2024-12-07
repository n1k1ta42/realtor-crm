import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { UserListSearch } from '@/routes/_auth/users.index.tsx'
import { Organization } from '@/types/organization.ts'
import { format } from '@formkit/tempo'
import { useNavigate } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  organizations: Organization[]
  search: UserListSearch
}

const columnHelper = createColumnHelper<Organization>()

export const List = ({ search, organizations }: Props) => {
  const navigate = useNavigate()

  const [sorting, setSorting] = useState<SortingState>([
    { id: search.orderBy, desc: search.direction === 'desc' },
  ])

  const handleSorting = async () => {
    await navigate({
      to: '/organizations',
      search: {
        ...search,
        orderBy: sorting[0].id,
        direction: sorting[0].desc ? 'desc' : 'asc',
      },
    })
  }

  const columns = [
    columnHelper.accessor(row => row.name, {
      id: 'name',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Имя</span>,
    }),
    columnHelper.accessor(row => row.email, {
      id: 'email',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Email</span>,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.phone, {
      id: 'phone',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Телефон</span>,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.address, {
      id: 'address',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Адрес</span>,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.CreatedAt, {
      id: 'CreatedAt',
      cell: info => (
        <i>{format(info.getValue(), { date: 'medium', time: 'short' })}</i>
      ),
      header: () => <span>Дата создания</span>,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.users, {
      id: 'users',
      cell: info => <i>{info.getValue()?.length || 0}</i>,
      header: () => <span>Количество пользователей</span>,
      enableSorting: false,
    }),
  ]

  const table = useReactTable({
    columns,
    data: organizations,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  useEffect(() => {
    handleSorting()
  }, [sorting])

  return (
    <Table>
      <TableHeader className='sticky top-0 z-50 bg-background'>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}>
                <div
                  className={
                    header.column.getCanSort()
                      ? 'flex cursor-pointer select-none items-center gap-2'
                      : ''
                  }
                  onClick={header.column.getToggleSortingHandler()}
                  title={
                    header.column.getCanSort()
                      ? header.column.getNextSortingOrder() === 'asc'
                        ? 'Sort ascending'
                        : header.column.getNextSortingOrder() === 'desc'
                          ? 'Sort descending'
                          : 'Clear sort'
                      : undefined
                  }
                >
                  <div>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </div>
                  <div>
                    {{
                      asc: <ArrowDownNarrowWide width={16} />,
                      desc: <ArrowUpNarrowWide width={16} />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map(row => (
          <TableRow
            key={row.id}
            onClick={() =>
              navigate({
                to: '/organizations/$organizationId',
                params: { organizationId: row.original.ID.toString() },
              })
            }
          >
            {row.getVisibleCells().map(cell => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
