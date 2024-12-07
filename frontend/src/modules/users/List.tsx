import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
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
import { User } from '@/types/user.ts'
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
  users: User[]
  organizations: Organization[]
  search: UserListSearch
}

const columnHelper = createColumnHelper<User>()

export const List = ({ users, search, organizations }: Props) => {
  const navigate = useNavigate()

  const [sorting, setSorting] = useState<SortingState>([
    { id: search.orderBy, desc: search.direction === 'desc' },
  ])

  const handleSorting = async () => {
    await navigate({
      to: '/users',
      search: {
        ...search,
        orderBy: sorting[0].id,
        direction: sorting[0].desc ? 'desc' : 'asc',
      },
    })
  }

  const columns = [
    columnHelper.accessor(row => row.avatar, {
      id: 'avatar',
      cell: info => (
        <Avatar className='h-8 w-8 rounded-lg'>
          <AvatarImage
            className='object-cover'
            src={info.getValue()}
            alt={`${info.row.original.name} ${info.row.original.surname}`}
          />
          <AvatarFallback className='rounded-lg'>
            {info.row.original.name[0].toLocaleUpperCase()}
            {info.row.original.surname[0].toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      header: () => <span>Аватар</span>,
    }),
    columnHelper.accessor(row => row.name, {
      id: 'name',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Имя</span>,
    }),
    columnHelper.accessor(row => row.surname, {
      id: 'surname',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Фамилия</span>,
    }),
    columnHelper.accessor(row => row.email, {
      id: 'email',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Email</span>,
    }),
    columnHelper.accessor(row => row.role, {
      id: 'role',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Роль</span>,
    }),
    columnHelper.accessor(row => row.organizationId, {
      id: 'organizationId',
      cell: info => (
        <i>{organizations.find(o => o.ID === info.getValue())?.name}</i>
      ),
      header: () => <span>Органиция</span>,
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
    columnHelper.accessor(row => row.clients, {
      id: 'clients',
      cell: info => <i>{info.getValue()?.length || 0}</i>,
      header: () => <span>Количество клиентов</span>,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.deals, {
      id: 'deals',
      cell: info => <i>{info.getValue()?.length || 0}</i>,
      header: () => <span>Количество сделок</span>,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.objects, {
      id: 'objects',
      cell: info => <i>{info.getValue()?.length || 0}</i>,
      header: () => <span>Количество объектов недвижемости</span>,
      enableSorting: false,
    }),
  ]

  const table = useReactTable({
    columns,
    data: users,
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
                to: '/users/$userId',
                params: { userId: row.original.ID.toString() },
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
