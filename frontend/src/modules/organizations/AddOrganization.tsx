import { api } from '@/api'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { organizationListQueryOptions } from '@/queryOptions/organizationListQueryOptions.ts'
import { OrganizationListSearch } from '@/routes/_auth/organizations.index.tsx'
import { useForm } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { AxiosError } from 'axios'
import { clsx } from 'clsx'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  name: z
    .string({
      required_error: 'Введите имя',
    })
    .min(1, {
      message: 'Обязательное поле',
    })
    .trim(),
  address: z
    .string({
      required_error: 'Введите адрес',
    })
    .min(1, {
      message: 'Обязательное поле',
    })
    .trim(),
  email: z
    .string({
      required_error: 'Введите email',
    })
    .email({
      message: 'Введите корректный email',
    }),
  phone: z
    .string({
      required_error: 'Введите телефон',
    })
    .min(1, {
      message: 'Обязательное поле',
    })
    .trim(),
})

type Form = z.infer<typeof formSchema>

type Props = {
  search: OrganizationListSearch
}

export const AddOrganization = ({ search }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const { refetch } = useSuspenseQuery(organizationListQueryOptions(search))

  const saveUserMutation = useMutation({
    mutationFn: async (value: Form) => {
      return api.organization.create(value)
    },
    onSuccess: () => {
      toast.success('Организация успешно создан')
      form.reset()
      setIsOpen(false)
      refetch()
    },
    onError: error => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data)
        return
      }
      toast.error('Что то пошло не так на сервере')
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      address: '',
      email: '',
      phone: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmitAsync: formSchema,
    },
    onSubmit: async ({ value }) => {
      await saveUserMutation.mutateAsync(value)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Добавить организацию
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Созадние организации</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          className='space-y-4'
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className='space-y-4'>
            <form.Field
              name='name'
              children={field => {
                return (
                  <div className='space-y-1'>
                    <Label htmlFor={field.name}>Название:</Label>
                    <Input
                      className={clsx({
                        ['border-destructive']: field.state.meta.errors.length,
                      })}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length ? (
                      <em className='text-xs text-destructive'>
                        {field.state.meta.errors.join(',')}
                      </em>
                    ) : null}
                  </div>
                )
              }}
            />
            <form.Field
              name='address'
              children={field => {
                return (
                  <div className='space-y-1'>
                    <Label htmlFor={field.name}>Адрес:</Label>
                    <Input
                      className={clsx({
                        ['border-destructive']: field.state.meta.errors.length,
                      })}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length ? (
                      <em className='text-xs text-destructive'>
                        {field.state.meta.errors.join(',')}
                      </em>
                    ) : null}
                  </div>
                )
              }}
            />
            <form.Field
              name='email'
              children={field => {
                return (
                  <div className='space-y-1'>
                    <Label htmlFor={field.name}>Email:</Label>
                    <Input
                      className={clsx({
                        ['border-destructive']: field.state.meta.errors.length,
                      })}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length ? (
                      <em className='text-xs text-destructive'>
                        {field.state.meta.errors.join(',')}
                      </em>
                    ) : null}
                  </div>
                )
              }}
            />
            <form.Field
              name='phone'
              children={field => {
                return (
                  <div className='space-y-1'>
                    <Label htmlFor={field.name}>Телефон:</Label>
                    <Input
                      className={clsx({
                        ['border-destructive']: field.state.meta.errors.length,
                      })}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length ? (
                      <em className='text-xs text-destructive'>
                        {field.state.meta.errors.join(',')}
                      </em>
                    ) : null}
                  </div>
                )
              }}
            />
          </div>
          <form.Subscribe
            selector={state => [state.isFormValid, state.isSubmitting]}
            children={([isValid, isSubmitting]) => (
              <div className='flex items-center justify-end space-x-4'>
                <Button type='submit' disabled={isValid && isSubmitting}>
                  {isValid && isSubmitting ? '...' : 'Создать'}
                </Button>
                <DialogClose asChild>
                  <Button
                    variant='secondary'
                    type='button'
                    onClick={() => {
                      form.reset()
                    }}
                  >
                    Закрыть
                  </Button>
                </DialogClose>
              </div>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
