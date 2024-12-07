import { Layout } from '@/components/layout.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { AddOrganization } from '@/modules/organizations/AddOrganization.tsx'
import { List } from '@/modules/organizations/List.tsx'
import { Paginator } from '@/modules/organizations/Paginator.tsx'
import { organizationListQueryOptions } from '@/queryOptions/organizationListQueryOptions.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const organizationListSearchSchema = z.object({
  limit: z.number().catch(25),
  offset: z.number().catch(0),
  orderBy: z.string().catch('name'),
  direction: z.string().catch('asc'),
})

export type OrganizationListSearch = z.infer<
  typeof organizationListSearchSchema
>

export const Route = createFileRoute('/_auth/organizations/')({
  component: RouteComponent,
  pendingComponent: () => (
    <Layout links={[]}>
      <div className='space-y-4'>
        <Skeleton className='h-[calc(100vh-252px)] w-full' />
        <Skeleton className='h-9 w-full' />
      </div>
    </Layout>
  ),
  validateSearch: search => organizationListSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps }) => {
    return queryClient.ensureQueryData(organizationListQueryOptions(deps))
  },
})

function RouteComponent() {
  const search = Route.useSearch()

  const queryOrganizations = useSuspenseQuery(
    organizationListQueryOptions(search),
  )

  return (
    <Layout
      links={[
        {
          href: '/organizations',
          label: `Организации (${queryOrganizations.data.count})`,
        },
      ]}
    >
      <div className='space-y-4'>
        <div className='flex justify-end p-1'>
          <AddOrganization search={search} />
        </div>
        <ScrollArea className='h-[calc(100vh-208px)]'>
          <List
            organizations={queryOrganizations.data.organizations}
            search={search}
          />
        </ScrollArea>
        <Paginator count={queryOrganizations.data.count} search={search} />
      </div>
    </Layout>
  )
}
