import { toast } from 'sonner'

export function toastUndo(message: string, onUndo: () => void, duration = 5000) {
  toast(message, {
    duration,
    action: {
      label: 'Undo',
      onClick: onUndo,
    },
  })
}
