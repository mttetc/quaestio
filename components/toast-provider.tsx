'use client'

import { deleteCookie, getCookie } from '@/utils/cookies'
import { PropsWithChildren, useEffect } from 'react'
import { useToast } from './ui/use-toast'

export interface ActionCookie {
  title: string
  message?: string
}

const ToastProvider = ({ children }: PropsWithChildren) => {
  const { toast } = useToast()
  const action = getCookie('action')

  useEffect(() => {
    if (!action) return

    const decodedAction = decodeURIComponent(action)
    const cookie: ActionCookie = JSON.parse(decodedAction)

    toast({
      title: cookie.title,
      description: cookie.message,
    })

    deleteCookie('action')
  }, [toast, action])

  return children
}

export default ToastProvider
