import { Layout } from '@/components/layout.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { AddUser } from '@/modules/users/AddUser.tsx'
import { FilterOrganizations } from '@/modules/users/FilterOrganizations.tsx'
import { List } from '@/modules/users/List.tsx'
import { Paginator } from '@/modules/users/Paginator.tsx'
import { organizationListQueryOptions } from '@/queryOptions/organizationListQueryOptions.ts'
import { userListQueryOptions } from '@/queryOptions/userListQueryOptions.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const userListSearchSchema = z.object({
  limit: z.number().catch(25),
  offset: z.number().catch(0),
  orderBy: z.string().catch('id'),
  direction: z.string().catch('asc'),
  organizationId: z.number().optional().catch(0),
})

export type UserListSearch = z.infer<typeof userListSearchSchema>

export const Route = createFileRoute('/_auth/users/')({
  component: RouteComponent,
  pendingComponent: () => (
    <Layout links={[]}>
      <div className='space-y-4'>
        <Skeleton className='h-11 w-full' />
        <Skeleton className='h-[calc(100vh-208px)] w-full' />
        <Skeleton className='h-9 w-full' />
      </div>
    </Layout>
  ),
  validateSearch: search => userListSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps }) => {
    await queryClient.ensureQueryData(userListQueryOptions(deps))

    await queryClient.ensureQueryData(
      organizationListQueryOptions({
        limit: 1000,
        offset: 0,
      }),
    )
  },
})

function RouteComponent() {
  const search = Route.useSearch()
  const queryUsers = useSuspenseQuery(userListQueryOptions(search))

  const queryOrganizations = useSuspenseQuery(
    organizationListQueryOptions({
      limit: 1000,
      offset: 0,
    }),
  )

  return (
    <Layout
      links={[
        { href: '/users', label: `Пользователи (${queryUsers.data.count})` },
      ]}
    >
      <div className='space-y-4'>
        <div className='flex justify-between p-1'>
          <FilterOrganizations
            organizations={queryOrganizations.data.organizations}
            search={search}
          />
          <AddUser
            search={search}
            organizations={queryOrganizations.data.organizations}
          />
        </div>
        <ScrollArea className='h-[calc(100vh-208px)]'>
          <List
            users={queryUsers.data.users}
            organizations={queryOrganizations.data.organizations}
            search={search}
          />
        </ScrollArea>
        <Paginator count={queryUsers.data.count} search={search} />
      </div>
    </Layout>
  )
}
