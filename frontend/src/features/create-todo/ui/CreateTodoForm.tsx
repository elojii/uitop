import { useForm, Controller } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, FormField } from '@/shared/ui'
import { useCreateTodo } from '../hooks/useCreateTodo'
import type { Category } from '@/entities/category'

interface FormValues {
  text: string
  categoryId: string
}

interface Props {
  categories: Category[]
}

export function CreateTodoForm({ categories }: Props) {
  const { create, isCreating } = useCreateTodo()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { text: '', categoryId: '' } })

  const submit = async (values: FormValues) => {
    const err = await create(values.text.trim(), Number(values.categoryId))
    if (err) setError('root', { message: err })
    else reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <FormField error={errors.text?.message} className="flex-1 min-w-48">
          <Input
            placeholder="Task text…"
            hasError={!!errors.text}
            {...register('text', {
              required: 'Text is required',
              validate: (v) => v.trim().length > 0 || 'Text is required',
            })}
          />
        </FormField>

        <FormField error={errors.categoryId?.message}>
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger hasError={!!errors.categoryId} className="w-[180px]">
                  <SelectValue placeholder="Category…" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <Button type="submit" disabled={isCreating}>
          {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
          Add task
        </Button>
      </div>

      {errors.root && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}
    </form>
  )
}
