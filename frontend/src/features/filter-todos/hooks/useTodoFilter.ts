import { useState } from 'react'

export function useTodoFilter() {
  const [selected, setSelected] = useState<number | undefined>(undefined)

  return { selected, setSelected }
}
