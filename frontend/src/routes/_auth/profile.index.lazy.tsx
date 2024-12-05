import { Layout } from '@/components/layout.tsx'
import { profileQueryOptions } from '@/queryOptions/profileQueryOptions.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const profile = useSuspenseQuery(profileQueryOptions).data

  return (
    <Layout links={[{ href: '/profile', label: 'Профиль пользователя' }]}>
      {profile.name} {profile.surname} {profile.email}
    </Layout>
  )
}
