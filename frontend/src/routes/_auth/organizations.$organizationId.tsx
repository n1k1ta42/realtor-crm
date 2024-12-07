import { Layout } from '@/components/layout.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { queryClient } from '@/main.tsx'
import { organizationByIdQueryOptions } from '@/queryOptions/organizationByIdQueryOptions.tsx'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
} from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/organizations/$organizationId')({
  component: RouteComponent,
  pendingComponent: () => (
    <Layout links={[]}>
      <div className='space-y-4'>
        <Skeleton className='h-[210px] w-full' />
      </div>
    </Layout>
  ),
  loader: ({ params: { organizationId } }) => {
    return queryClient.ensureQueryData(
      organizationByIdQueryOptions(organizationId),
    )
  },
  errorComponent: PostErrorComponent,
})

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function RouteComponent() {
  const id = Route.useParams().organizationId

  const { data: organization } = useSuspenseQuery(
    organizationByIdQueryOptions(id),
  )

  return (
    <Layout
      links={[
        { href: '/organizations', label: 'Организации' },
        {
          href: `/organizations/${organization.ID}`,
          label: organization.name,
        },
      ]}
    >
      {/*<div className="space-y-4">*/}
      {/*  <Card>*/}
      {/*    <CardHeader>*/}
      {/*      <CardTitle className="flex items-start justify-between">*/}
      {/*        <div className="flex items-center space-x-4">*/}
      {/*          <Avatar className="h-20 w-20 rounded-full">*/}
      {/*            <AvatarImage*/}
      {/*              className="object-cover"*/}
      {/*              src={user.avatar}*/}
      {/*              alt={`${user.name} ${user.surname}`}*/}
      {/*            />*/}
      {/*            <AvatarFallback className="rounded-lg">*/}
      {/*              {user.name[0].toLocaleUpperCase()}*/}
      {/*              {user.surname[0].toLocaleUpperCase()}*/}
      {/*            </AvatarFallback>*/}
      {/*          </Avatar>*/}
      {/*        </div>*/}
      {/*        <div className="space-x-2">*/}
      {/*          <EditUser id={user.ID} />*/}
      {/*          <DeleteUser id={user.ID} />*/}
      {/*        </div>*/}
      {/*      </CardTitle>*/}
      {/*    </CardHeader>*/}
      {/*    <CardContent className="flex gap-8">*/}
      {/*      <div className="flex flex-col justify-between border-r-2 pr-8">*/}
      {/*        <div className="text-sm text-muted-foreground">ФИО:</div>*/}
      {/*        <div className="flex items-center space-x-2">*/}
      {/*          <div>*/}
      {/*            {user.name} {user.surname}*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div className="flex flex-col justify-between border-r-2 pr-8">*/}
      {/*        <div className="text-sm text-muted-foreground">Должность:</div>*/}
      {/*        <div className="flex items-center space-x-2">*/}
      {/*          <div>{user.role}</div>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div className="flex flex-col justify-between border-r-2 pr-8">*/}
      {/*        <div className="text-sm text-muted-foreground">Email:</div>*/}
      {/*        <div className="flex items-center space-x-2">*/}
      {/*          <a*/}
      {/*            href={'mailto:' + user.email}*/}
      {/*            className="text-primary underline"*/}
      {/*          >*/}
      {/*            {user.email}*/}
      {/*          </a>*/}
      {/*          <Button onClick={handleCopy} variant="ghost">*/}
      {/*            <CopyIcon />*/}
      {/*          </Button>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div className="flex flex-col justify-between">*/}
      {/*        <div className="text-sm text-muted-foreground">Организация:</div>*/}
      {/*        <div>{organization.name}</div>*/}
      {/*      </div>*/}
      {/*    </CardContent>*/}
      {/*  </Card>*/}
      {/*</div>*/}
    </Layout>
  )
}
