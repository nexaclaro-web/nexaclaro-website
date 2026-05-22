import { useState, useCallback } from 'react'

export type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const MESSAGES = {
  loading: 'Се испраќа...',
  success: 'Пораката е успешно испратена.',
  error: 'Настана грешка. Обидете се повторно.',
} as const

export function useFormSubmit(delay = 1400) {
  const [status, setStatus] = useState<FormStatus>('idle')

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setStatus('loading')
      try {
        await new Promise((r) => setTimeout(r, delay))
        setStatus('success')
        setTimeout(() => setStatus('idle'), 5000)
        return true
      } catch {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 5000)
        return false
      }
    },
    [delay],
  )

  const reset = useCallback(() => setStatus('idle'), [])

  const message =
    status === 'loading'
      ? MESSAGES.loading
      : status === 'success'
        ? MESSAGES.success
        : status === 'error'
          ? MESSAGES.error
          : ''

  return { status, submit, reset, message, isLoading: status === 'loading' }
}
