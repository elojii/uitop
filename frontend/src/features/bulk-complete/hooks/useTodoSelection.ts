import { useCallback, useMemo, useState } from 'react'

export function useTodoSelection(allIds: number[]) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const allSelected = useMemo(
    () => allIds.length > 0 && allIds.every((id) => selectedIds.has(id)),
    [allIds, selectedIds],
  )

  const someSelected = selectedIds.size > 0

  const toggle = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    setSelectedIds(allSelected ? new Set() : new Set(allIds))
  }, [allSelected, allIds])

  const clear = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const removeIds = useCallback((ids: number[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }, [])

  return {
    selectedIds,
    allSelected,
    someSelected,
    toggle,
    toggleAll,
    clear,
    removeIds,
  }
}
