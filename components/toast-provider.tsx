'use client'

import { PropsWithChildren, useEffect } from 'react'
import { useToast } from './ui/use-toast'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const ToastProvider = ({ children }: PropsWithChildren) => {
  const { toast } = useToast()
  const pathname = usePathname()
  const router = useRouter()
  const urlParams = useSearchParams()

  useEffect(() => {
    const action = urlParams.get('action')
    if (!action) return

    //TODO: translate action
    toast({
      title: action,
    })

    router.replace(pathname)
  }, [router, toast, urlParams, pathname])

  return children
}

export default ToastProvider
