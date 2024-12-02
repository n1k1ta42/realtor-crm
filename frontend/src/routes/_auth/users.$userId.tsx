import { Layout } from '@/components/layout.tsx'
import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
} from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/users/$userId')({
  loader: ({ params: { userId } }) => userId,
  errorComponent: PostErrorComponent,
  notFoundComponent: () => {
    return <p>Post not found</p>
  },
  component: RouteComponent,
})

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function RouteComponent() {
  const userId = Route.useLoaderData()

  return (
    <Layout
      links={[
        { href: '/users', label: 'Пользователи' },
        { href: `/${userId}`, label: `${userId}` },
      ]}
    ></Layout>
  )
}
