import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination.tsx'
import { UserListSearch } from '@/routes/_auth/users.index.tsx'
import { linkOptions } from '@tanstack/react-router'
import { clsx } from 'clsx'

type Props = {
  search: UserListSearch
  count: number
}

export const Paginator = ({ search, count }: Props) => {
  const currentPage = Math.floor(search.offset / search.limit) + 1
  const totalPages = Math.ceil(count / search.limit)

  const getPageLink = (page: number) =>
    linkOptions({
      to: '/users',
      search: {
        ...search,
        offset: (page - 1) * search.limit,
      },
    })

  const pages = []
  const siblingCount = 1
  const firstPage = 1
  const lastPage = totalPages
  const startPage = Math.max(currentPage - siblingCount, firstPage)
  const endPage = Math.min(currentPage + siblingCount, lastPage)

  for (let page = startPage; page <= endPage; page++) {
    pages.push(
      <PaginationItem key={page}>
        <PaginationLink {...getPageLink(page)} isActive={page === currentPage}>
          {page}
        </PaginationLink>
      </PaginationItem>,
    )
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            {...getPageLink(currentPage - 1)}
            disabled={currentPage === firstPage}
            className={clsx({
              'cursor-not-allowed !bg-muted': currentPage === firstPage,
            })}
          />
        </PaginationItem>
        {startPage > firstPage + 1 && (
          <>
            <PaginationItem>
              <PaginationLink {...getPageLink(firstPage)}>
                {firstPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {pages}
        {endPage < lastPage - 1 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink {...getPageLink(lastPage)}>
                {lastPage}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            {...getPageLink(currentPage + 1)}
            disabled={currentPage === lastPage}
            className={clsx({
              'cursor-not-allowed !bg-muted': currentPage === lastPage,
            })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
