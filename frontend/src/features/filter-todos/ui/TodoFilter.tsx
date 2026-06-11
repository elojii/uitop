import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui'
import type { Category } from '@/entities/category'

interface Props {
  categories: Category[]
  selected: number | undefined
  onChange: (categoryId: number | undefined) => void
}

export function TodoFilter({ categories, selected, onChange }: Props) {
  return (
    <Select
      value={selected !== undefined ? String(selected) : 'all'}
      onValueChange={(value) => onChange(value === 'all' ? undefined : Number(value))}
    >
      <SelectTrigger className="w-[180px]" aria-label="Filter by category">
        <SelectValue placeholder="All categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        {categories.map((c) => (
          <SelectItem key={c.id} value={String(c.id)}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
