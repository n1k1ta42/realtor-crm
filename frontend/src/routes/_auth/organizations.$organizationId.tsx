import { Layout } from '@/components/layout.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { queryClient } from '@/main.tsx'
import { DeleteOrganization } from '@/modules/organizations/DeleteOrganization.tsx'
import { EditOrganization } from '@/modules/organizations/EditOrganization.tsx'
import { organizationByIdQueryOptions } from '@/queryOptions/organizationByIdQueryOptions.tsx'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
} from '@tanstack/react-router'
import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useCopyToClipboard } from 'usehooks-ts'

export const Route = createFileRoute('/_auth/organizations/$organizationId')({
  component: RouteComponent,
  pendingComponent: () => (
    <Layout links={[]}>
      <div className='space-y-4'>
        <Skeleton className='h-[162px] w-full' />
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
  const [, setCopy] = useCopyToClipboard()

  const { data: organization } = useSuspenseQuery(
    organizationByIdQueryOptions(id),
  )

  const handleCopy = () => {
    toast.promise(setCopy(organization.email), {
      loading: 'Копирование',
      success: 'Email скопирован',
      error: 'Ошибка копирования',
    })
  }

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
      <div className='space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-start justify-between'>
              <div className='flex items-center space-x-4'>
                {organization.name}
              </div>
              <div className='space-x-2'>
                <EditOrganization id={organization.ID} />
                <DeleteOrganization id={organization.ID} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className='flex gap-8'>
            <div className='flex flex-col justify-between border-r-2 pr-8'>
              <div className='text-sm text-muted-foreground'>Адрес:</div>
              <div className='flex items-center space-x-2'>
                <div>{organization.address}</div>
              </div>
            </div>
            <div className='flex flex-col justify-between border-r-2 pr-8'>
              <div className='text-sm text-muted-foreground'>Email:</div>
              <div className='flex items-center space-x-2'>
                <a
                  href={'mailto:' + organization.email}
                  className='text-primary underline'
                >
                  {organization.email}
                </a>
                <Button onClick={handleCopy} variant='ghost'>
                  <CopyIcon />
                </Button>
              </div>
            </div>
            <div className='flex flex-col justify-between'>
              <div className='text-sm text-muted-foreground'>Телефон:</div>
              <div>{organization.phone}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
