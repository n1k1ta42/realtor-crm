import { Layout } from '@/components/layout.tsx'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Layout links={[{ href: '/users', label: 'Пользователи' }]}></Layout>
}
