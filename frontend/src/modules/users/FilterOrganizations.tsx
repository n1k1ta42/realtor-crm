import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { UserListSearch } from '@/routes/_auth/users.index.tsx'
import { Organization } from '@/types/organization.ts'
import { useNavigate } from '@tanstack/react-router'

type Props = {
  organizations: Organization[]
  search: UserListSearch
}

export const FilterOrganizations = ({ search, organizations }: Props) => {
  const navigate = useNavigate()

  const handleOrganizationChange = async (value: string) => {
    await navigate({
      to: '/users',
      search: {
        ...search,
        organizationId: Number(value),
      },
    })
  }

  return (
    <Select
      onValueChange={handleOrganizationChange}
      value={search.organizationId ? `${search.organizationId}` : undefined}
    >
      <SelectTrigger className='w-[250px]'>
        <SelectValue
          aria-label={`${search.organizationId}`}
          placeholder='Выберите организацию'
        />
      </SelectTrigger>
      <SelectContent>
        {organizations.map(o => (
          <SelectItem key={o.ID} value={`${o.ID}`}>
            {o.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
