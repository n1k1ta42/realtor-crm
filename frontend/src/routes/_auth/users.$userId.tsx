import { Layout } from '@/components/layout.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { queryClient } from '@/main.tsx'
import { DeleteUser } from '@/modules/users/DeleteUser.tsx'
import { EditUser } from '@/modules/users/EditUser.tsx'
import { userByIdQueryOptions } from '@/queryOptions/userByIdQueryOptions.tsx'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
} from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/users/$userId')({
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
  loader: ({ params: { userId } }) => {
    return queryClient.ensureQueryData(userByIdQueryOptions(userId))
  },
  errorComponent: PostErrorComponent,
})

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function RouteComponent() {
  const id = Route.useParams().userId
  const { data: user } = useSuspenseQuery(userByIdQueryOptions(id))

  return (
    <Layout
      links={[
        { href: '/users', label: 'Пользователи' },
        { href: `/users/${user.ID}`, label: `${user.name} ${user.surname}` },
      ]}
    >
      <div className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between space-x-2'>
            <h1 className='text-2xl'>Профиль</h1>
            <div className='space-x-2'>
              <EditUser id={user.ID} />
              <DeleteUser id={user.ID} />
            </div>
          </div>
          <p className='text-sm text-muted-foreground'>
            Тут собрана вся информация о пользователе
          </p>
        </div>
        <Separator />
        <div>
          <div>Имя</div>
          <div className='text-sm text-muted-foreground'>{user.name}</div>
        </div>
        <div>
          <div>Фамилия</div>
          <div className='text-sm text-muted-foreground'>{user.surname}</div>
        </div>
        <div>
          <div>Должность</div>
          <div className='text-sm text-muted-foreground'>{user.role}</div>
        </div>
        <div>
          <div>Email</div>
          <div className='text-sm text-muted-foreground'>{user.email}</div>
        </div>
      </div>
    </Layout>
  )
}
