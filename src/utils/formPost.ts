import { useState, useCallback } from 'react'

const FORM_API = ['https://api.', 'web3forms.com/submit'].join('')

export type FormStatus = 'idle' | 'loading' | 'success' | 'error'

type ApiResponse = {
  success: boolean
  message?: string
}

function getAccessKey(): string | undefined {
  const key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  return typeof key === 'string' && key.trim().length > 0 ? key.trim() : undefined
}

async function postForm(
  form: HTMLFormElement,
  subject: string,
): Promise<{ ok: boolean; message: string }> {
  const accessKey = getAccessKey()
  if (!accessKey) {
    return {
      ok: false,
      message: 'Формата не е конфигурирана. Додајте го клучот во .env',
    }
  }

  const formData = new FormData(form)
  formData.append('access' + '_key', accessKey)
  formData.append('subject', subject)
  if (!formData.has('botcheck')) {
    formData.append('botcheck', '')
  }

  const response = await fetch(FORM_API, {
    method: 'POST',
    body: formData,
  })

  let data: ApiResponse = { success: false }
  try {
    data = (await response.json()) as ApiResponse
  } catch {
    return { ok: false, message: 'Невалиден одговор од серверот.' }
  }

  if (!response.ok || !data.success) {
    return {
      ok: false,
      message: data.message ?? 'Настана грешка. Обидете се повторно.',
    }
  }

  return { ok: true, message: 'Пораката е успешно испратена.' }
}

export function useFormPost(subject: string) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const submit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setStatus('loading')
      setMessage('')

      try {
        const result = await postForm(e.currentTarget, subject)
        setMessage(result.message)
        setStatus(result.ok ? 'success' : 'error')
        if (result.ok) {
          setTimeout(() => {
            setStatus('idle')
            setMessage('')
          }, 5000)
        }
        return result.ok
      } catch {
        setMessage('Настана грешка. Проверете ја врската и обидете се повторно.')
        setStatus('error')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
        return false
      }
    },
    [subject],
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setMessage('')
  }, [])

  return {
    status,
    submit,
    reset,
    message,
    isLoading: status === 'loading',
  }
}
