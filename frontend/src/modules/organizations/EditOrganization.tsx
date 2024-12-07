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
import { organizationByIdQueryOptions } from '@/queryOptions/organizationByIdQueryOptions.tsx'
import { useForm } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { AxiosError } from 'axios'
import { clsx } from 'clsx'
import { EditIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .refine(val => val === '' || val.length >= 2, {
      message: 'Название должно содержать как минимум 2 символа',
    })
    .optional(),
  address: z
    .string()
    .trim()
    .refine(val => val === '' || val.length >= 2, {
      message: 'Адрес должен содержать как минимум 2 символа',
    })
    .optional(),
  email: z
    .string()
    .trim()
    .refine(val => val === '' || z.string().email().safeParse(val).success, {
      message: 'Введите корректный email',
    })
    .optional(),
  phone: z
    .string()
    .trim()
    .refine(val => val === '' || val.length >= 2, {
      message: 'Телефон должен содержать как минимум 2 символа',
    })
    .optional(),
})

type Form = z.infer<typeof formSchema>

type Props = {
  id: number
}

export const EditOrganization = ({ id }: Props) => {
  const { refetch } = useSuspenseQuery(
    organizationByIdQueryOptions(id.toString()),
  )
  const [isOpen, setIsOpen] = useState(false)

  const saveUserMutation = useMutation({
    mutationFn: async (value: Form) => {
      return api.organization.edit(id, value)
    },
    onSuccess: () => {
      toast.success('Организация успешно отредактирована')
    },
    onError: error => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data)
        return
      }
      toast.error('Что-то пошло не так на сервере')
    },
    onSettled: () => {
      refetch()
      setIsOpen(false)
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
      form.reset()
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' variant='secondary'>
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование организации</DialogTitle>
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
                <Button type='submit' disabled={!isValid || isSubmitting}>
                  {isValid && isSubmitting ? '...' : 'Сохранить'}
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
