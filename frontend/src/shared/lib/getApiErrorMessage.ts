import axios from 'axios'

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response?.status === 400) {
    return (err.response.data as { message?: string })?.message ?? fallback
  }
  return fallback
}
