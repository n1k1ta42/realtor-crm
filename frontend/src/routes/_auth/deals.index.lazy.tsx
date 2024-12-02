import { Layout } from '@/components/layout.tsx'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/deals/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Layout links={[{ href: '/objects', label: 'Объекты' }]}></Layout>
}
