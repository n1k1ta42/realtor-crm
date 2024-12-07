import { Layout } from '@/components/layout.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { queryClient } from '@/main.tsx'
import { DeleteUser } from '@/modules/users/DeleteUser.tsx'
import { EditUser } from '@/modules/users/EditUser.tsx'
import { organizationByIdQueryOptions } from '@/queryOptions/organizationByIdQueryOptions.tsx'
import { userByIdQueryOptions } from '@/queryOptions/userByIdQueryOptions.tsx'
import { format } from '@formkit/tempo'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
} from '@tanstack/react-router'
import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useCopyToClipboard } from 'usehooks-ts'

export const Route = createFileRoute('/_auth/users/$userId')({
  component: RouteComponent,
  pendingComponent: () => (
    <Layout links={[]}>
      <div className='space-y-4'>
        <Skeleton className='h-[210px] w-full' />
        <Skeleton className='h-[90px] w-full' />
      </div>
    </Layout>
  ),
  loader: ({ params: { userId } }) => {
    return queryClient.ensureQueryData(userByIdQueryOptions(userId))
  },
  errorComponent: PostErrorComponent,
})

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function RouteComponent() {
  const [, setCopy] = useCopyToClipboard()
  const id = Route.useParams().userId
  const { data: user } = useSuspenseQuery(userByIdQueryOptions(id))

  const { data: organization } = useSuspenseQuery(
    organizationByIdQueryOptions(user.organizationId.toString()),
  )

  const handleCopy = () => {
    toast.promise(setCopy(user.email), {
      loading: 'Копирование',
      success: 'Email скопирован',
      error: 'Ошибка копирования',
    })
  }

  return (
    <Layout
      links={[
        { href: '/users', label: 'Пользователи' },
        { href: `/users/${user.ID}`, label: `${user.name} ${user.surname}` },
      ]}
    >
      <div className='space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-start justify-between'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-20 w-20 rounded-full'>
                  <AvatarImage
                    className='object-cover'
                    src={user.avatar}
                    alt={`${user.name} ${user.surname}`}
                  />
                  <AvatarFallback className='rounded-lg'>
                    {user.name[0].toLocaleUpperCase()}
                    {user.surname[0].toLocaleUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className='space-x-2'>
                <EditUser id={user.ID} />
                <DeleteUser id={user.ID} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className='flex gap-8'>
            <div className='flex flex-col justify-between border-r-2 pr-8'>
              <div className='text-sm text-muted-foreground'>ФИО:</div>
              <div className='flex items-center space-x-2'>
                <div>
                  {user.name} {user.surname}
                </div>
              </div>
            </div>
            <div className='flex flex-col justify-between border-r-2 pr-8'>
              <div className='text-sm text-muted-foreground'>Должность:</div>
              <div className='flex items-center space-x-2'>
                <div>{user.role}</div>
              </div>
            </div>
            <div className='flex flex-col justify-between border-r-2 pr-8'>
              <div className='text-sm text-muted-foreground'>Email:</div>
              <div className='flex items-center space-x-2'>
                <a
                  href={'mailto:' + user.email}
                  className='text-primary underline'
                >
                  {user.email}
                </a>
                <Button onClick={handleCopy} variant='ghost'>
                  <CopyIcon />
                </Button>
              </div>
            </div>
            <div className='flex flex-col justify-between'>
              <div className='text-sm text-muted-foreground'>Организация:</div>
              <div>{organization.name}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Дата создания</CardTitle>
            <CardDescription>
              {format(user.CreatedAt, { date: 'long', time: 'short' })}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </Layout>
  )
}
