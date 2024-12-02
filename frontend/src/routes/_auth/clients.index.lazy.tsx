import { Layout } from '@/components/layout.tsx'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/clients/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Layout links={[{ href: '/clients', label: 'Клиенты' }]}></Layout>
}
