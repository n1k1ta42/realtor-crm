import { Layout } from '@/components/layout.tsx'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout
      links={[{ href: '/profile', label: 'Профиль пользователя' }]}
    ></Layout>
  )
}
