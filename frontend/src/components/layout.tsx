import { AppSidebar } from '@/components/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle.tsx'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Fragment, PropsWithChildren } from 'react'

type Link = {
  href: string
  label: string
}
type Props = {
  links: Link[]
} & PropsWithChildren

export function Layout({ children, links }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex w-full items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                {links.map((link, index) => (
                  <Fragment key={link.href}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to={link.href}>{link.label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < links.length - 1 && (
                      <BreadcrumbSeparator className='hidden md:block' />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className='flex flex-1 justify-end'>
              <ModeToggle />
            </div>
          </div>
        </header>
        <ScrollArea className='h-[calc(100vh-64px)] w-full p-4'>
          {children}
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
